/**
 * Migration script to add created_at column to customer table
 * and update existing records with current timestamp
 */

const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

async function runMigration() {
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting migration: Adding created_at column to customer table');

    // Check if the column already exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'customer' AND column_name = 'created_at'
    `;
    
    const columnExists = await sequelize.query(checkColumnQuery, { 
      type: QueryTypes.SELECT,
      transaction
    });

    if (columnExists.length === 0) {
      // Add the created_at column if it doesn't exist
      console.log('Column does not exist. Adding created_at column...');
      
      await sequelize.query(`
        ALTER TABLE customer 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `, { transaction });
      
      console.log('Column added successfully');
    } else {
      console.log('Column already exists. Skipping column creation.');
    }

    // Update existing records that have NULL created_at
    console.log('Updating existing records with NULL created_at...');
    
    await sequelize.query(`
      UPDATE customer 
      SET created_at = CURRENT_TIMESTAMP 
      WHERE created_at IS NULL
    `, { transaction });

    console.log('Migration completed successfully');
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('Migration completed. Exiting...');
      process.exit(0);
    })
    .catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

module.exports = runMigration;
