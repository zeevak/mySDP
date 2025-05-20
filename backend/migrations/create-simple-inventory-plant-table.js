/**
 * Migration script to create a simple inventory_plant table
 */

const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

async function runMigration() {
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting migration: Creating simple inventory_plant table');

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
          plant_name VARCHAR(255) NOT NULL,
          scientific_name VARCHAR(255),
          description TEXT
        )
      `, { transaction });
      
      console.log('inventory_plant table created successfully');
    } else {
      console.log('inventory_plant table already exists. Checking for columns to modify...');
      
      // Check if inventory_id column exists
      const checkInventoryIdQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'inventory_plant' AND column_name = 'inventory_id'
        )
      `;
      
      const hasInventoryId = await sequelize.query(checkInventoryIdQuery, { 
        type: QueryTypes.SELECT,
        transaction
      });
      
      if (hasInventoryId[0].exists) {
        console.log('Removing inventory_id column from inventory_plant table...');
        
        // Drop the foreign key constraint first
        await sequelize.query(`
          ALTER TABLE inventory_plant 
          DROP CONSTRAINT IF EXISTS inventory_plant_inventory_id_fkey
        `, { transaction });
        
        // Then drop the column
        await sequelize.query(`
          ALTER TABLE inventory_plant 
          DROP COLUMN inventory_id
        `, { transaction });
        
        console.log('inventory_id column removed successfully');
      }
      
      // Check for other columns that should be removed
      const checkColumnsQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'inventory_plant' AND column_name = 'growth_time_months'
        ) as has_growth_time,
        EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'inventory_plant' AND column_name = 'care_instructions'
        ) as has_care_instructions
      `;
      
      const columnCheck = await sequelize.query(checkColumnsQuery, { 
        type: QueryTypes.SELECT,
        transaction
      });
      
      if (columnCheck[0].has_growth_time) {
        await sequelize.query(`
          ALTER TABLE inventory_plant 
          DROP COLUMN growth_time_months
        `, { transaction });
        
        console.log('growth_time_months column removed successfully');
      }
      
      if (columnCheck[0].has_care_instructions) {
        await sequelize.query(`
          ALTER TABLE inventory_plant 
          DROP COLUMN care_instructions
        `, { transaction });
        
        console.log('care_instructions column removed successfully');
      }
      
      // Check if scientific_name and description columns exist, add them if they don't
      const checkRequiredColumnsQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'inventory_plant' AND column_name = 'scientific_name'
        ) as has_scientific_name,
        EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'inventory_plant' AND column_name = 'description'
        ) as has_description
      `;
      
      const requiredColumnCheck = await sequelize.query(checkRequiredColumnsQuery, { 
        type: QueryTypes.SELECT,
        transaction
      });
      
      if (!requiredColumnCheck[0].has_scientific_name) {
        await sequelize.query(`
          ALTER TABLE inventory_plant 
          ADD COLUMN scientific_name VARCHAR(255)
        `, { transaction });
        
        console.log('scientific_name column added successfully');
      }
      
      if (!requiredColumnCheck[0].has_description) {
        await sequelize.query(`
          ALTER TABLE inventory_plant 
          ADD COLUMN description TEXT
        `, { transaction });
        
        console.log('description column added successfully');
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
