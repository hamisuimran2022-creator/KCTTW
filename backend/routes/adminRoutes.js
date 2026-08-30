const express = require("express");
const {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    getAllCustomers,
    toggleUserRole
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Apply protect & adminOnly middleware to all admin endpoints
router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);
router.get("/customers", getAllCustomers);
router.patch("/users/:id/role", toggleUserRole);

module.exports = router;
