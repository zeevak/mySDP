const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const inventoryController = require('./controllers/inventoryController');
const Inventory = require('./models/Inventory');
const sequelize = require('./config/db');

console.log('Debug server starting...');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
  res.send('Debug server is running!');
});

// Test direct model creation
app.get('/test-model', async (req, res) => {
  try {
    console.log('Testing direct model creation...');
    
    const newItem = await Inventory.create({
      item_name: 'Test Plant Direct',
      item_type: 'Plant',
      quantity: 10,
      staff_id: null
    });
    
    console.log('Successfully created inventory item:', newItem.toJSON());
    
    res.json({
      success: true,
      message: 'Test item created successfully',
      data: newItem
    });
    
    // Clean up - delete the test item
    await newItem.destroy();
    console.log('Test item deleted');
    
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create test item',
      details: error.message
    });
  }
});

// Test controller
app.post('/test-controller', (req, res) => {
  console.log('Testing controller with body:', req.body);
  
  // Mock user for testing
  req.user = null;
  
  // Call controller method
  inventoryController.createInventory(req, res);
});

// Start server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
  console.log(`Try these endpoints:
  - GET http://localhost:${PORT}/test-model
  - POST http://localhost:${PORT}/test-controller with JSON body: { "item_name": "Test Plant", "quantity": 10 }
  `);
});
