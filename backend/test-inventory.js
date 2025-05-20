const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const inventoryController = require('./controllers/inventoryController');

console.log('Test server starting...');
console.log('Inventory controller methods:', Object.keys(inventoryController));

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
  res.send('Test server is running!');
});

// Inventory routes
app.post('/api/inventory', (req, res) => {
  console.log('Received POST request to /api/inventory:', req.body);
  // Add mock user to request
  req.user = null;
  inventoryController.createInventory(req, res);
});

app.get('/api/inventory', (req, res) => {
  console.log('Received GET request to /api/inventory');
  inventoryController.getAllInventory(req, res);
});

// Start server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Try posting to http://localhost:${PORT}/api/inventory with JSON body: { "item_name": "Test Plant", "quantity": 10 }`);
});
