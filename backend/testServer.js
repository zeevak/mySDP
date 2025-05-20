const express = require("express");
const cors = require("cors");
const inventoryController = require('./controllers/inventoryController');

console.log("Test server starting...");
console.log("Inventory controller methods:", Object.keys(inventoryController));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Test server is running!");
});

// Inventory routes
app.get("/api/inventory", (req, res) => {
  req.user = { id: 1 }; // Mock user for testing
  inventoryController.getAllInventory(req, res);
});

app.post("/api/inventory", (req, res) => {
  req.user = { id: 1 }; // Mock user for testing
  console.log("Received POST request:", req.body);
  inventoryController.createInventory(req, res);
});

// Start server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
