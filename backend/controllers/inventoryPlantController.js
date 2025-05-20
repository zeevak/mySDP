// controllers/inventoryPlantController.js
/**
 * Inventory Plant Controller
 * Handles CRUD operations for plant details in inventory
 */

const InventoryPlant = require('../models/InventoryPlant');
const { Op } = require('sequelize');

/**
 * Get all plants
 * @route GET /api/inventory/plants
 * @access Private (Admin, Staff)
 */
exports.getAllPlants = async (req, res) => {
  try {
    const plants = await InventoryPlant.findAll({
      order: [['plant_name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (err) {
    console.error('Error fetching plants:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve plants'
    });
  }
};

/**
 * Get a single plant by ID
 * @route GET /api/inventory/plants/:id
 * @access Private (Admin, Staff)
 */
exports.getPlantById = async (req, res) => {
  try {
    const { id } = req.params;

    const plant = await InventoryPlant.findByPk(id);

    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: plant
    });
  } catch (err) {
    console.error('Error fetching plant:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve plant'
    });
  }
};

/**
 * Create a new plant
 * @route POST /api/inventory/plants
 * @access Private (Admin only)
 */
exports.createPlant = async (req, res) => {
  try {
    const { plant_name, scientific_name, description } = req.body;

    // Validate required fields
    if (!plant_name) {
      return res.status(400).json({
        success: false,
        error: 'Please provide plant name'
      });
    }

    // Check if plant already exists
    const existingPlant = await InventoryPlant.findOne({
      where: {
        plant_name: {
          [Op.iLike]: plant_name.trim() // Case-insensitive search
        }
      }
    });

    if (existingPlant) {
      return res.status(400).json({
        success: false,
        error: 'Plant already exists in the database'
      });
    }

    // Create new plant entry
    const newPlant = await InventoryPlant.create({
      plant_name: plant_name.trim(),
      scientific_name: scientific_name || null,
      description: description || null
    });

    res.status(201).json({
      success: true,
      message: 'Plant added successfully',
      data: newPlant
    });
  } catch (err) {
    console.error('Error creating plant:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to add plant'
    });
  }
};

/**
 * Update a plant
 * @route PUT /api/inventory/plants/:id
 * @access Private (Admin only)
 */
exports.updatePlant = async (req, res) => {
  try {
    const { id } = req.params;
    const { plant_name, scientific_name, description } = req.body;

    // Find the plant
    const plant = await InventoryPlant.findByPk(id);

    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found'
      });
    }

    // Update plant details
    if (plant_name) plant.plant_name = plant_name;
    if (scientific_name !== undefined) plant.scientific_name = scientific_name;
    if (description !== undefined) plant.description = description;

    await plant.save();

    res.status(200).json({
      success: true,
      message: 'Plant updated successfully',
      data: plant
    });
  } catch (err) {
    console.error('Error updating plant:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update plant'
    });
  }
};

/**
 * Delete a plant
 * @route DELETE /api/inventory/plants/:id
 * @access Private (Admin only)
 */
exports.deletePlant = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the plant
    const plant = await InventoryPlant.findByPk(id);

    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found'
      });
    }

    // Delete the plant
    await plant.destroy();

    res.status(200).json({
      success: true,
      message: 'Plant deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting plant:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete plant'
    });
  }
};
