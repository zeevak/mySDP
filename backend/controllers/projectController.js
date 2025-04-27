// controllers/projectController.js
const Project = require("../models/Project");

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { staff_id: req.user.id }, // Adjust based on user role
    });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};