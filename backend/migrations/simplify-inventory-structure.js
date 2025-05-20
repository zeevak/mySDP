/**
 * Migration script to simplify inventory structure
 */

const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

async function runMigration() {
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting migration: Simplifying inventory structure');

    // Check if inventory_plant table exists
    const checkPlantTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'inventory_plant'
      )
    `;
    
    const plantTableExists = await sequelize.query(checkPlantTableQuery, { 
      type: QueryTypes.SELECT,
      transaction
    });

    if (plantTableExists[0].exists) {
      console.log('Dropping inventory_plant table...');
      
      // Drop the inventory_plant table
      await sequelize.query(`
        DROP TABLE IF EXISTS inventory_plant
      `, { transaction });
      
      console.log('inventory_plant table dropped successfully');
    }

    // Check if inventory table exists
    const checkInventoryTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'inventory'
      )
    `;
    
    const inventoryTableExists = await sequelize.query(checkInventoryTableQuery, { 
      type: QueryTypes.SELECT,
      transaction
    });

    if (inventoryTableExists[0].exists) {
      console.log('Checking inventory table structure...');
      
      // Check if item_name and item_type columns exist
      const checkColumnsQuery = `
        SELECT 
          EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'inventory' AND column_name = 'item_name') as has_item_name,
          EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'inventory' AND column_name = 'item_type') as has_item_type,
          EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'inventory' AND column_name = 'last_updated') as has_last_updated
      `;
      
      const columnCheck = await sequelize.query(checkColumnsQuery, { 
        type: QueryTypes.SELECT,
        transaction
      });
      
      // Add item_name column if it doesn't exist
      if (!columnCheck[0].has_item_name) {
        await sequelize.query(`
          ALTER TABLE inventory 
          ADD COLUMN item_name VARCHAR(255) NOT NULL DEFAULT 'Unknown Plant'
        `, { transaction });
        
        console.log('Added item_name column to inventory table');
      }
      
      // Add item_type column if it doesn't exist
      if (!columnCheck[0].has_item_type) {
        await sequelize.query(`
          ALTER TABLE inventory 
          ADD COLUMN item_type VARCHAR(15) DEFAULT 'Plant' CHECK (item_type IN ('Plant'))
        `, { transaction });
        
        console.log('Added item_type column to inventory table');
      }
      
      // Remove last_updated column if it exists
      if (columnCheck[0].has_last_updated) {
        await sequelize.query(`
          ALTER TABLE inventory 
          DROP COLUMN last_updated
        `, { transaction });
        
        console.log('Removed last_updated column from inventory table');
      }
    } else {
      console.log('Inventory table does not exist. Creating it...');
      
      await sequelize.query(`
        CREATE TABLE inventory (
          inventory_id SERIAL PRIMARY KEY,
          staff_id INTEGER REFERENCES staff(staff_id) ON DELETE SET NULL,
          item_name VARCHAR(255) NOT NULL,
          item_type VARCHAR(15) DEFAULT 'Plant' CHECK (item_type IN ('Plant')),
          quantity INTEGER NOT NULL DEFAULT 0
        )
      `, { transaction });
      
      console.log('Inventory table created successfully');
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
