const express = require('express');
const cors = require('cors');
const inventoryController = require('./controllers/inventoryController');

console.log('Debug server starting...');
console.log('Inventory controller methods:', Object.keys(inventoryController));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Debug server is running!');
});

// Mock request to test inventory creation
const mockReq = {
  user: { id: 1 }, // Mock authenticated user
  body: {
    item_name: 'Test Plant',
    quantity: 10
  }
};

// Mock response
const mockRes = {
  status: (code) => {
    console.log(`Response status: ${code}`);
    return {
      json: (data) => {
        console.log('Response data:', data);
      }
    };
  }
};

// Test inventory creation
console.log('Testing inventory creation...');
try {
  inventoryController.createInventory(mockReq, mockRes);
} catch (err) {
  console.error('Error in createInventory:', err);
}

// Start server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
});
