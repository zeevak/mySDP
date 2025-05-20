// controllers/inventoryController.js
/**
 * Inventory Controller
 * Handles CRUD operations for inventory items
 */

const Inventory = require('../models/Inventory');
const { Op } = require('sequelize');

// Define exports at the beginning
const inventoryController = {

  getAllInventory: async (req, res) => {
    try {
      const inventory = await Inventory.findAll({
        order: [['item_name', 'ASC']]
      });

      res.status(200).json({
        success: true,
        count: inventory.length,
        data: inventory
      });
    } catch (err) {
      console.error('Error fetching inventory:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve inventory items'
      });
    }
  },

  getInventoryById: async (req, res) => {
    try {
      const { id } = req.params;

      const inventoryItem = await Inventory.findByPk(id);

      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          error: 'Inventory item not found'
        });
      }

      res.status(200).json({
        success: true,
        data: inventoryItem
      });
    } catch (err) {
      console.error('Error fetching inventory item:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve inventory item'
      });
    }
  },

  createInventory: async (req, res) => {
    console.log('Create inventory request body:', req.body);
    const { item_name, quantity } = req.body;

    try {
      // Validate required fields
      if (!item_name || !quantity) {
        return res.status(400).json({
          success: false,
          error: 'Please provide item name and quantity'
        });
      }

      // Validate item name (letters, numbers, and spaces only)
      if (!/^[A-Za-z0-9\s]+$/.test(item_name)) {
        return res.status(400).json({
          success: false,
          error: 'Item name should only contain letters, numbers, and spaces'
        });
      }

      // Validate quantity (must be a positive number)
      if (isNaN(quantity) || parseInt(quantity) <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Quantity must be a positive number'
        });
      }

      // Check if item already exists
      const existingItem = await Inventory.findOne({
        where: {
          item_name: {
            [Op.iLike]: item_name.trim() // Case-insensitive search
          }
        }
      });

      if (existingItem) {
        // Update quantity instead of creating new item
        existingItem.quantity += parseInt(quantity);
        await existingItem.save();

        return res.status(200).json({
          success: true,
          message: `Added ${quantity} units to existing ${item_name}`,
          data: existingItem
        });
      }

      // Create new inventory item
      const newItem = await Inventory.create({
        item_name: item_name.trim(),
        quantity: parseInt(quantity)
      });

      res.status(201).json({
        success: true,
        message: 'Plant added to inventory successfully',
        data: newItem
      });
    } catch (err) {
      console.error('Error creating inventory item:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to create inventory item'
      });
    }
  },

  updateInventory: async (req, res) => {
    const { id } = req.params;
    console.log('Update inventory request body:', req.body);
    const { item_name, quantity } = req.body;

    try {
      // Find the inventory item
      const inventoryItem = await Inventory.findByPk(id);

      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          error: 'Inventory item not found'
        });
      }

      // Validate item name if provided (letters, numbers, and spaces only)
      if (item_name && !/^[A-Za-z0-9\s]+$/.test(item_name)) {
        return res.status(400).json({
          success: false,
          error: 'Item name should only contain letters, numbers, and spaces'
        });
      }

      // Validate quantity if provided (must be a positive number)
      if (quantity !== undefined && (isNaN(quantity) || parseInt(quantity) < 0)) {
        return res.status(400).json({
          success: false,
          error: 'Quantity must be a non-negative number'
        });
      }

      // Check if item name is being changed and already exists
      if (item_name && item_name !== inventoryItem.item_name) {
        const existingItem = await Inventory.findOne({
          where: {
            item_name: {
              [Op.iLike]: item_name.trim()
            },
            inventory_id: {
              [Op.ne]: id
            }
          }
        });

        if (existingItem) {
          return res.status(400).json({
            success: false,
            error: 'Item name already exists'
          });
        }
      }

      // Update the inventory item
      inventoryItem.item_name = item_name || inventoryItem.item_name;
      inventoryItem.quantity = quantity !== undefined ? parseInt(quantity) : inventoryItem.quantity;

      await inventoryItem.save();

      res.status(200).json({
        success: true,
        message: 'Inventory item updated successfully',
        data: inventoryItem
      });
    } catch (err) {
      console.error('Error updating inventory item:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to update inventory item'
      });
    }
  },

  deleteInventory: async (req, res) => {
    const { id } = req.params;

    try {
      // Find the inventory item
      const inventoryItem = await Inventory.findByPk(id);

      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          error: 'Inventory item not found'
        });
      }

      // Delete the inventory item
      await inventoryItem.destroy();

      res.status(200).json({
        success: true,
        message: 'Inventory item deleted successfully'
      });
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to delete inventory item'
      });
    }
  },

  reduceInventory: async (req, res) => {
    try {
      const { inventory_id, quantity, customer_id } = req.body;

      // Validate required fields
      if (!inventory_id || !quantity || !customer_id) {
        return res.status(400).json({
          success: false,
          error: 'Please provide inventory ID, quantity, and customer ID'
        });
      }

      // Validate quantity (must be a positive number)
      if (isNaN(quantity) || parseInt(quantity) <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Quantity must be a positive number'
        });
      }

      // Find the inventory item
      const inventoryItem = await Inventory.findByPk(inventory_id);

      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          error: 'Inventory item not found'
        });
      }

      // Check if there's enough quantity
      if (inventoryItem.quantity < quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient inventory. Only ${inventoryItem.quantity} ${inventoryItem.item_name} available.`,
          available: inventoryItem.quantity
        });
      }

      // Reduce the quantity
      inventoryItem.quantity -= quantity;
      await inventoryItem.save();

      res.status(200).json({
        success: true,
        message: `Successfully reduced ${quantity} units of ${inventoryItem.item_name}`,
        data: inventoryItem
      });
    } catch (err) {
      console.error('Error reducing inventory:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to reduce inventory'
      });
    }
  }
};

// Add logging to verify exports
console.log('Inventory Controller Exports:', Object.keys(inventoryController));

module.exports = inventoryController;
