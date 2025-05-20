// migrations/update-proposal-schema.js
const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Migration to update the proposal table schema:
 * 1. Add project_type field (moved from project table)
 * 2. Add project_duration field
 * 3. Add project_value field
 * 4. Update payment_mode validation to use 'installments' instead of 'installment'
 */
module.exports = async function() {
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting migration: Updating proposal table schema');

    // Check if proposal table exists
    const tableCheck = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'proposal'
      )
    `, {
      type: QueryTypes.SELECT,
      transaction
    });

    if (!tableCheck[0].exists) {
      console.log('Proposal table does not exist. Migration cannot proceed.');
      await transaction.rollback();
      return;
    }

    // Check for existing columns
    const columnCheck = await sequelize.query(`
      SELECT
        EXISTS(SELECT FROM information_schema.columns WHERE table_name = 'proposal' AND column_name = 'project_type') as has_project_type,
        EXISTS(SELECT FROM information_schema.columns WHERE table_name = 'proposal' AND column_name = 'project_duration') as has_project_duration,
        EXISTS(SELECT FROM information_schema.columns WHERE table_name = 'proposal' AND column_name = 'project_value') as has_project_value,
        (SELECT data_type FROM information_schema.columns WHERE table_name = 'proposal' AND column_name = 'customer_id') as customer_id_type
    `, {
      type: QueryTypes.SELECT,
      transaction
    });

    // Add project_type column if it doesn't exist
    if (!columnCheck[0].has_project_type) {
      await sequelize.query(`
        ALTER TABLE proposal
        ADD COLUMN project_type VARCHAR(10) CHECK (project_type IN ('Agarwood', 'Sandalwood', 'Vanilla', 'Other'))
      `, { transaction });

      console.log('Added project_type column to proposal table');
    } else {
      console.log('project_type column already exists in proposal table');
    }

    // Add project_duration column if it doesn't exist
    if (!columnCheck[0].has_project_duration) {
      await sequelize.query(`
        ALTER TABLE proposal
        ADD COLUMN project_duration INTEGER
      `, { transaction });

      console.log('Added project_duration column to proposal table');
    } else {
      console.log('project_duration column already exists in proposal table');
    }

    // Add project_value column if it doesn't exist
    if (!columnCheck[0].has_project_value) {
      await sequelize.query(`
        ALTER TABLE proposal
        ADD COLUMN project_value DECIMAL(10, 2)
      `, { transaction });

      console.log('Added project_value column to proposal table');
    } else {
      console.log('project_value column already exists in proposal table');
    }

    // Update payment_mode check constraint to use 'installments' instead of 'installment'
    await sequelize.query(`
      ALTER TABLE proposal
      DROP CONSTRAINT IF EXISTS proposal_payment_mode_check;

      ALTER TABLE proposal
      ADD CONSTRAINT proposal_payment_mode_check
      CHECK (payment_mode IN ('full', 'installments'));
    `, { transaction });

    console.log('Updated payment_mode check constraint in proposal table');

    // Fix customer_id data type if it's not VARCHAR
    if (columnCheck[0].customer_id_type && columnCheck[0].customer_id_type !== 'character varying') {
      console.log(`Current customer_id data type: ${columnCheck[0].customer_id_type}. Updating to VARCHAR(10)...`);

      // First, drop any foreign key constraints
      await sequelize.query(`
        DO $$
        DECLARE
          constraint_name text;
        BEGIN
          SELECT conname INTO constraint_name
          FROM pg_constraint
          WHERE conrelid = 'proposal'::regclass
          AND conkey @> ARRAY[
            (SELECT attnum FROM pg_attribute WHERE attrelid = 'proposal'::regclass AND attname = 'customer_id')
          ]
          AND contype = 'f';

          IF constraint_name IS NOT NULL THEN
            EXECUTE 'ALTER TABLE proposal DROP CONSTRAINT ' || constraint_name;
          END IF;
        END $$;
      `, { transaction });

      // Then update the column type
      await sequelize.query(`
        ALTER TABLE proposal
        ALTER COLUMN customer_id TYPE VARCHAR(10);
      `, { transaction });

      // Re-add the foreign key constraint
      await sequelize.query(`
        ALTER TABLE proposal
        ADD CONSTRAINT proposal_customer_id_fkey
        FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE;
      `, { transaction });

      console.log('Updated customer_id column type to VARCHAR(10)');
    } else {
      console.log('customer_id column already has the correct data type');
    }

    // Commit the transaction
    await transaction.commit();
    console.log('Migration completed successfully');
  } catch (error) {
    await transaction.rollback();
    console.error('Migration failed:', error);
    throw error;
  }
};
