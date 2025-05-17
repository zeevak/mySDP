// routes/land.js
const express = require("express");
const router = express.Router();
const landController = require("../controllers/landController");

router.post("/check", landController.checkEligibility);
router.post("/save-visitor", landController.saveVisitorData);

module.exports = router;