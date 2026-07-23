const { CustomerLand, Customer } = require('../models');
const { Op } = require('sequelize');

const landManagementController = {
  /**
   * Get all lands
   * @route GET /api/staff/lands
   * @access Private (Staff, Admin)
   */
  getAllLands: async (req, res) => {
    try {
      // Fetch all lands
      const lands = await CustomerLand.findAll({
        include: [
          {
            model: Customer,
            attributes: ['customer_id', 'title', 'full_name', 'phone_no_1']
          }
        ],
        order: [['customer_land_id', 'ASC']]
      });

      res.status(200).json({
        success: true,
        count: lands.length,
        data: lands
      });
    } catch (err) {
      console.error('Error fetching lands:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve lands'
      });
    }
  },

  /**
   * Get land by ID
   * @route GET /api/staff/lands/:id
   * @access Private (Staff, Admin)
   */
  getLandById: async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch land by ID
      const land = await CustomerLand.findByPk(id, {
        include: [
          {
            model: Customer,
            attributes: ['customer_id', 'title', 'full_name', 'phone_no_1']
          }
        ]
      });

      if (!land) {
        return res.status(404).json({
          success: false,
          error: 'Land not found'
        });
      }

      res.status(200).json({
        success: true,
        data: land
      });
    } catch (err) {
      console.error('Error fetching land:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve land'
      });
    }
  },

  /**
   * Update land
   * @route PUT /api/staff/lands/:id
   * @access Private (Staff, Admin)
   */
  updateLand: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        province,
        district,
        city,
        climate_zone,
        land_shape,
        has_water,
        soil_type,
        has_stones,
        has_landslide_risk,
        has_forestry,
        land_size
      } = req.body;

      // Check if land exists
      const land = await CustomerLand.findByPk(id);
      if (!land) {
        return res.status(404).json({
          success: false,
          error: 'Land not found'
        });
      }

      // Update land
      await land.update({
        province,
        district,
        city,
        climate_zone,
        land_shape,
        has_water,
        soil_type,
        has_stones,
        has_landslide_risk,
        has_forestry,
        land_size
      });

      res.status(200).json({
        success: true,
        message: 'Land updated successfully',
        data: land
      });
    } catch (err) {
      console.error('Error updating land:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to update land',
        details: err.message
      });
    }
  },

  /**
   * Delete land
   * @route DELETE /api/staff/lands/:id
   * @access Private (Staff, Admin)
   */
  deleteLand: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if land exists
      const land = await CustomerLand.findByPk(id);
      if (!land) {
        return res.status(404).json({
          success: false,
          error: 'Land not found'
        });
      }

      // 1. Find all proposals associated with this land
      const Proposal = require('../models/Proposal');
      const proposals = await Proposal.findAll({ where: { customer_land_id: id } });

      for (const proposal of proposals) {
        // Find and delete related project and its progress
        const Project = require('../models/Project');
        const project = await Project.findOne({ where: { proposal_id: proposal.proposal_id } });
        if (project) {
          const ProjectProgress = require('../models/ProjectProgress');
          await ProjectProgress.destroy({ where: { project_id: project.project_id } });

          const Progress = require('../models/progress');
          await Progress.destroy({ where: { project_id: project.project_id } });

          await project.destroy();
        }

        // Delete the proposal
        await proposal.destroy();
      }

      // 2. Delete land
      await land.destroy();

      res.status(200).json({
        success: true,
        message: 'Land and all associated proposals and projects deleted successfully'
      });
    } catch (err) {
      console.error('Error deleting land:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to delete land',
        details: err.message
      });
    }
  }
};

module.exports = landManagementController;
