const { Request, Customer } = require("../models");

// Create a new request (Customer endpoint)
const createRequest = async (req, res) => {
  try {
    const customer_id = req.user?.id || req.user?.customer_id;
    if (!customer_id) {
      return res.status(401).json({
        success: false,
        message: "Customer authentication required. Please log in.",
      });
    }

    const { request_type, request_details } = req.body;

    if (!request_details || !request_details.trim()) {
      return res.status(400).json({
        success: false,
        message: "Request details cannot be empty.",
      });
    }

    const newRequest = await Request.create({
      customer_id,
      request_type: request_type || "Inquiry",
      request_details: request_details.trim(),
      status: "Pending",
      request_date: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Your request has been submitted successfully!",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit request. Please try again later.",
      error: error.message,
    });
  }
};

// Get requests for logged-in customer
const getMyRequests = async (req, res) => {
  try {
    const customer_id = req.user?.id || req.user?.customer_id;
    if (!customer_id) {
      return res.status(401).json({
        success: false,
        message: "Customer authentication required.",
      });
    }

    const requests = await Request.findAll({
      where: { customer_id },
      order: [["request_date", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching customer requests:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your requests.",
      error: error.message,
    });
  }
};

// Get all requests (Staff / Admin endpoint)
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        {
          model: Customer,
          attributes: ["customer_id", "full_name", "f_name", "l_name", "email", "phone_no_1"],
          required: false
        },
      ],
      order: [["request_date", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching all requests with include:", error);
    try {
      const rawRequests = await Request.findAll({
        order: [["request_date", "DESC"]],
      });
      return res.status(200).json({
        success: true,
        data: rawRequests,
      });
    } catch (fallbackError) {
      console.error("Error fetching raw requests:", fallbackError);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch customer requests.",
        error: error.message,
      });
    }
  }
};

// Update request status (Staff / Admin endpoint)
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const requestItem = await Request.findByPk(id);
    if (!requestItem) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    if (status) {
      requestItem.status = status;
    }

    await requestItem.save();

    return res.status(200).json({
      success: true,
      message: `Request status updated to ${requestItem.status}`,
      data: requestItem,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update request status.",
      error: error.message,
    });
  }
};

// Delete a request (Staff / Admin endpoint)
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const requestItem = await Request.findByPk(id);
    if (!requestItem) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    await requestItem.destroy();

    return res.status(200).json({
      success: true,
      message: "Request deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete request.",
      error: error.message,
    });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
};
