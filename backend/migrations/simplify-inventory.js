/**
 * Migration script to simplify inventory table by removing staff_id and item_type
 */

const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

async function runMigration() {
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting migration: Simplifying inventory table');

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
      
      // Check if staff_id column exists
      const checkStaffIdQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'inventory' AND column_name = 'staff_id'
        )
      `;
      
      const staffIdExists = await sequelize.query(checkStaffIdQuery, { 
        type: QueryTypes.SELECT,
        transaction
      });
      
      if (staffIdExists[0].exists) {
        console.log('Removing staff_id column...');
        await sequelize.query(`
          ALTER TABLE inventory 
          DROP COLUMN staff_id
        `, { transaction });
        console.log('staff_id column removed');
      }
      
      // Check if item_type column exists
      const checkItemTypeQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'inventory' AND column_name = 'item_type'
        )
      `;
      
      const itemTypeExists = await sequelize.query(checkItemTypeQuery, { 
        type: QueryTypes.SELECT,
        transaction
      });
      
      if (itemTypeExists[0].exists) {
        console.log('Removing item_type column...');
        await sequelize.query(`
          ALTER TABLE inventory 
          DROP COLUMN item_type
        `, { transaction });
        console.log('item_type column removed');
      }
      
      console.log('Inventory table updated successfully');
    } else {
      console.log('Inventory table does not exist');
    }

    // Update plant_shipment table to remove the reference to inventory_id if needed
    const checkPlantShipmentQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'plant_shipment'
      )
    `;
    
    const plantShipmentExists = await sequelize.query(checkPlantShipmentQuery, { 
      type: QueryTypes.SELECT,
      transaction
    });

    if (plantShipmentExists[0].exists) {
      console.log('Checking plant_shipment table...');
      
      // We'll keep the inventory_id reference in plant_shipment as it's still valid
      // Just logging for confirmation
      console.log('plant_shipment table checked - no changes needed for inventory_id reference');
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
