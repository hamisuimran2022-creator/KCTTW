const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

/**
 * @desc    Get executive dashboard metrics
 * @route   GET /api/admin/stats
 * @access  Private / Admin
 */
const getDashboardStats = async (req, res, next) => {
    try {
        const [totalOrders, pendingOrders, processingOrders, deliveredOrders, totalCustomers, totalProducts] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ status: "Pending" }),
            Order.countDocuments({ status: "Processing" }),
            Order.countDocuments({ status: "Delivered" }),
            User.countDocuments(),
            Product.countDocuments()
        ]);

        // Calculate total gross revenue from paid orders
        const revenueAgg = await Order.aggregate([
            { $match: { paymentStatus: "Paid" } },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        // Recent 6 orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(6)
            .lean();

        return ApiResponse.success(res, "Dashboard statistics retrieved successfully.", {
            stats: {
                totalRevenue,
                totalOrders,
                pendingOrders: pendingOrders + processingOrders,
                deliveredOrders,
                totalCustomers,
                totalProducts
            },
            recentOrders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all orders with filtering and search
 * @route   GET /api/admin/orders
 * @access  Private / Admin
 */
const getAllOrders = async (req, res, next) => {
    try {
        const { status, paymentStatus, search, page = 1, limit = 20 } = req.query;
        let query = {};

        if (status && status !== "all") {
            query.status = status;
        }

        if (paymentStatus && paymentStatus !== "all") {
            query.paymentStatus = paymentStatus;
        }

        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: "i" } },
                { "customer.name": { $regex: search, $options: "i" } },
                { "customer.email": { $regex: search, $options: "i" } },
                { "customer.phone": { $regex: search, $options: "i" } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();

        return ApiResponse.success(res, "Orders retrieved successfully.", {
            orders,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/admin/orders/:id/status
 * @access  Private / Admin
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus, trackingNumber, notes } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return next(ApiError.notFound("Order not found."));
        }

        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (notes) order.notes = notes;

        await order.save();

        return ApiResponse.success(res, `Order #${order.orderNumber} updated successfully.`, { order });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all registered customers
 * @route   GET /api/admin/customers
 * @access  Private / Admin
 */
const getAllCustomers = async (req, res, next) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();

        // Attach order stats for each customer
        const customersWithStats = await Promise.all(
            users.map(async (u) => {
                const orders = await Order.find({ user: u._id }).select("total paymentStatus");
                const totalOrders = orders.length;
                const totalSpent = orders
                    .filter((o) => o.paymentStatus === "Paid")
                    .reduce((sum, o) => sum + (o.total || 0), 0);

                return {
                    ...u,
                    totalOrders,
                    totalSpent
                };
            })
        );

        return ApiResponse.success(res, "Customers retrieved successfully.", {
            customers: customersWithStats,
            total: customersWithStats.length
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Toggle User Role
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private / Admin
 */
const toggleUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["customer", "admin"].includes(role)) {
            return next(ApiError.badRequest("Invalid role. Must be 'customer' or 'admin'."));
        }

        const user = await User.findById(id);
        if (!user) {
            return next(ApiError.notFound("User not found."));
        }

        user.role = role;
        await user.save();

        return ApiResponse.success(res, `User ${user.fullName} role updated to ${role}.`, {
            user: user.toPublicProfile()
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    getAllCustomers,
    toggleUserRole
};
