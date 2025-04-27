// routes/projects.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const projectController = require("../controllers/projectController");

router.get("/", auth, projectController.getProjects);

module.exports = router;