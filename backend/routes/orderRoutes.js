const express = require("express");
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");
const { protect, optionalAuth, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Create order (supports guest and logged-in user)
router.post("/", optionalAuth, createOrder);

// Get current user's orders
router.get("/my-orders", protect, getMyOrders);

// Get specific order
router.get("/:id", optionalAuth, getOrderById);

// Admin routes
router.get("/", protect, adminOnly, getAllOrders);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
