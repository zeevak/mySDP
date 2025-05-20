/**
 * Migration script to remove the price column from the inventory table
 */

const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

async function runMigration() {
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting migration: Removing price column from inventory table');

    // Check if the column exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'inventory' AND column_name = 'price'
    `;
    
    const columnExists = await sequelize.query(checkColumnQuery, { 
      type: QueryTypes.SELECT,
      transaction
    });

    if (columnExists.length > 0) {
      // Remove the price column if it exists
      console.log('Price column exists. Removing it...');
      
      await sequelize.query(`
        ALTER TABLE inventory 
        DROP COLUMN price
      `, { transaction });
      
      console.log('Price column removed successfully');
    } else {
      console.log('Price column does not exist. No action needed.');
    }

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
