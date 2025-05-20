/**
 * Migration script to create inventory_plant table and update inventory table
 */

const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

async function runMigration() {
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting migration: Creating inventory_plant table and updating inventory table');

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

    if (!inventoryTableExists[0].exists) {
      console.log('Inventory table does not exist. Creating it...');

      await sequelize.query(`
        CREATE TABLE inventory (
          inventory_id SERIAL PRIMARY KEY,
          staff_id INTEGER REFERENCES staff(staff_id) ON DELETE SET NULL,
          quantity INTEGER NOT NULL DEFAULT 0,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, { transaction });

      console.log('Inventory table created successfully');
    } else {
      console.log('Inventory table exists. Checking for columns to modify...');

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

      // Get existing inventory data before modifying the table
      let inventoryData = [];
      if (columnCheck[0].has_item_name) {
        inventoryData = await sequelize.query(`
          SELECT inventory_id, item_name, quantity FROM inventory
        `, {
          type: QueryTypes.SELECT,
          transaction
        });

        console.log(`Found ${inventoryData.length} inventory items to migrate`);
      }

      // Add last_updated column if it doesn't exist
      if (!columnCheck[0].has_last_updated) {
        await sequelize.query(`
          ALTER TABLE inventory
          ADD COLUMN last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `, { transaction });

        console.log('Added last_updated column to inventory table');
      }

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

      if (!plantTableExists[0].exists) {
        console.log('Creating inventory_plant table...');

        await sequelize.query(`
          CREATE TABLE inventory_plant (
            plant_id SERIAL PRIMARY KEY,
            inventory_id VARCHAR(10) NOT NULL REFERENCES inventory(inventory_id) ON DELETE CASCADE,
            plant_name VARCHAR(255) NOT NULL
          )
        `, { transaction });

        console.log('inventory_plant table created successfully');

        // Migrate data from inventory to inventory_plant if we have item_name
        if (inventoryData.length > 0) {
          console.log('Migrating plant data from inventory to inventory_plant...');

          for (const item of inventoryData) {
            await sequelize.query(`
              INSERT INTO inventory_plant (inventory_id, plant_name)
              VALUES (${item.inventory_id}, '${item.item_name.replace(/'/g, "''")}')
            `, { transaction });
          }

          console.log('Data migration completed successfully');
        }
      }

      // Drop item_name and item_type columns if they exist
      if (columnCheck[0].has_item_name) {
        await sequelize.query(`
          ALTER TABLE inventory
          DROP COLUMN item_name
        `, { transaction });

        console.log('Dropped item_name column from inventory table');
      }

      if (columnCheck[0].has_item_type) {
        await sequelize.query(`
          ALTER TABLE inventory
          DROP COLUMN item_type
        `, { transaction });

        console.log('Dropped item_type column from inventory table');
      }
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
