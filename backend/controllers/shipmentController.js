// controllers/shipmentController.js
/**
 * Shipment Controller
 * Handles plant shipments to customers
 */

const PlantShipment = require('../models/PlantShipment');
const Inventory = require('../models/Inventory');
const Customer = require('../models/Customer');
const Staff = require('../models/Staff');
const sequelize = require('../config/db');

/**
 * Get all shipments
 * @route GET /api/shipment
 * @access Private (Admin, Staff)
 */
exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await PlantShipment.findAll({
      include: [
        {
          model: Staff,
          attributes: ['name']
        },
        {
          model: Customer,
          attributes: ['name_with_ini', 'email', 'phone_no_1']
        },
        {
          model: Inventory,
          attributes: ['item_name']
        }
      ],
      order: [['shipment_date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: shipments.length,
      data: shipments
    });
  } catch (err) {
    console.error('Error fetching shipments:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve shipments'
    });
  }
};

/**
 * Get shipments by customer
 * @route GET /api/shipment/customer/:customerId
 * @access Private (Admin, Staff)
 */
exports.getShipmentsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const shipments = await PlantShipment.findAll({
      where: { customer_id: customerId },
      include: [
        {
          model: Staff,
          attributes: ['name']
        },
        {
          model: Inventory,
          attributes: ['item_name']
        }
      ],
      order: [['shipment_date', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: shipments.length,
      data: shipments
    });
  } catch (err) {
    console.error('Error fetching customer shipments:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve customer shipments'
    });
  }
};

/**
 * Create a new shipment
 * @route POST /api/shipment
 * @access Private (Admin, Staff)
 */
exports.createShipment = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { customer_id, inventory_id, quantity, notes } = req.body;
    
    // Validate required fields
    if (!customer_id || !inventory_id || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Please provide customer ID, inventory ID, and quantity'
      });
    }
    
    // Check if customer exists
    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    // Check if inventory item exists and has enough quantity
    const inventoryItem = await Inventory.findByPk(inventory_id);
    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }
    
    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: `Insufficient inventory. Only ${inventoryItem.quantity} ${inventoryItem.item_name} available.`,
        available: inventoryItem.quantity
      });
    }
    
    // Create shipment record
    const shipment = await PlantShipment.create({
      staff_id: req.user.id, // Get staff ID from authenticated user
      customer_id,
      inventory_id,
      plant_name: inventoryItem.item_name,
      quantity,
      shipment_date: new Date(),
      notes: notes || null
    }, { transaction });
    
    // Reduce inventory quantity
    inventoryItem.quantity -= quantity;
    await inventoryItem.save({ transaction });
    
    await transaction.commit();
    
    res.status(201).json({
      success: true,
      message: `Successfully shipped ${quantity} ${inventoryItem.item_name} to customer`,
      data: shipment
    });
  } catch (err) {
    await transaction.rollback();
    console.error('Error creating shipment:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create shipment'
    });
  }
};

/**
 * Delete a shipment (Admin only)
 * @route DELETE /api/shipment/:id
 * @access Private (Admin only)
 */
exports.deleteShipment = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Find the shipment
    const shipment = await PlantShipment.findByPk(id);
    
    if (!shipment) {
      return res.status(404).json({
        success: false,
        error: 'Shipment not found'
      });
    }
    
    // Find the inventory item
    const inventoryItem = await Inventory.findByPk(shipment.inventory_id);
    
    if (inventoryItem) {
      // Return the quantity to inventory
      inventoryItem.quantity += shipment.quantity;
      await inventoryItem.save({ transaction });
    }
    
    // Delete the shipment
    await shipment.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(200).json({
      success: true,
      message: 'Shipment deleted successfully'
    });
  } catch (err) {
    await transaction.rollback();
    console.error('Error deleting shipment:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete shipment'
    });
  }
};
