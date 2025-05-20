const { Sequelize } = require('sequelize');
const sequelize = require('./config/db');
const Inventory = require('./models/Inventory');

async function testInventoryCreation() {
  try {
    console.log('Testing direct inventory creation...');
    
    // Try to create an inventory item directly using the model
    const newItem = await Inventory.create({
      item_name: 'Test Plant Direct',
      item_type: 'Plant',
      quantity: 10,
      staff_id: null
    });
    
    console.log('Successfully created inventory item:', newItem.toJSON());
    
    // Clean up - delete the test item
    await newItem.destroy();
    console.log('Test item deleted');
    
  } catch (error) {
    console.error('Error creating inventory item:', error);
    
    // If it's a Sequelize validation error, log more details
    if (error instanceof Sequelize.ValidationError) {
      console.error('Validation errors:');
      error.errors.forEach(err => {
        console.error(`- ${err.path}: ${err.message}`);
      });
    }
    
    // If it's a database error, log more details
    if (error.name === 'SequelizeDatabaseError') {
      console.error('Database error details:', error.original);
    }
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed');
  }
}

// Run the test
testInventoryCreation();
