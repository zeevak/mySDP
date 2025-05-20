/**
 * Migration script to make staff_id nullable in inventory table
 */

const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

async function runMigration() {
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting migration: Making staff_id nullable in inventory table');

    // Check if inventory table exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'inventory'
      )
    `;
    
    const tableExists = await sequelize.query(checkTableQuery, { 
      type: QueryTypes.SELECT,
      transaction
    });

    if (tableExists[0].exists) {
      console.log('Updating inventory table...');
      
      // Alter the staff_id column to allow NULL values
      await sequelize.query(`
        ALTER TABLE inventory 
        ALTER COLUMN staff_id DROP NOT NULL
      `, { transaction });
      
      console.log('inventory table updated successfully');
    } else {
      console.log('inventory table does not exist');
    }

    await transaction.commit();
    console.log('Migration completed successfully');
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
