const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const { protect, authorize } = require("../middleware/auth");

// Customer routes
router.post("/", protect, authorize(["customer", "Customer"]), requestController.createRequest);
router.get("/my-requests", protect, authorize(["customer", "Customer"]), requestController.getMyRequests);

// Staff / Admin routes
router.get("/", protect, authorize(["Staff", "Admin", "staff", "admin"]), requestController.getAllRequests);
router.put("/:id/status", protect, authorize(["Staff", "Admin", "staff", "admin"]), requestController.updateRequestStatus);
router.delete("/:id", protect, authorize(["Staff", "Admin", "staff", "admin"]), requestController.deleteRequest);

module.exports = router;
