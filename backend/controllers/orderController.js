const Order = require("../models/Order");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const { sendOrderConfirmationEmail, sendAdminOrderAlertEmail } = require("../services/emailService");

/**
 * @desc    Create a new order (supports guest and authenticated users)
 * @route   POST /api/orders
 * @access  Public / Optional Auth
 */
const createOrder = async (req, res, next) => {
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            items,
            shippingAddress,
            paymentMethod,
            notes
        } = req.body;

        // Validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return next(ApiError.badRequest("Your cart is empty. Please add items to order."));
        }

        const name = customerName || (req.user && req.user.fullName);
        const email = customerEmail || (req.user && req.user.email);
        const phone = customerPhone || (req.user && req.user.phone);

        if (!name || !email || !phone) {
            return next(ApiError.badRequest("Please provide your name, email, and phone number."));
        }

        // Process and validate items + compute server-side totals
        let subtotal = 0;
        const processedItems = items.map((item) => {
            const price = Number(item.price) || 0;
            const quantity = Math.max(1, Number(item.quantity) || 1);
            const itemTotal = price * quantity;
            subtotal += itemTotal;

            return {
                productId: String(item.id || item.productId || "kcttw-item"),
                name: String(item.name || "KCTTW Apparel").trim(),
                price,
                quantity,
                color: String(item.color || "Default").trim(),
                size: String(item.size || "Standard").trim(),
                image: String(item.image || ""),
                itemTotal
            };
        });

        const shippingFee = 0; // Flat or dynamic shipping fee
        const total = subtotal + shippingFee;

        // Build order payload
        const orderData = {
            user: req.user ? req.user._id : undefined,
            customer: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim()
            },
            items: processedItems,
            subtotal,
            shippingFee,
            total,
            shippingAddress: typeof shippingAddress === "string" 
                ? { street: shippingAddress } 
                : (shippingAddress || {}),
            paymentMethod: paymentMethod || "paystack",
            paymentStatus: "Pending",
            status: "Pending",
            notes: notes || ""
        };

        const order = await Order.create(orderData);

        // Send confirmation email to customer and notification to store admin asynchronously
        sendOrderConfirmationEmail(order).catch((err) =>
            console.error("Order confirmation email failed:", err.message)
        );
        sendAdminOrderAlertEmail(order).catch((err) =>
            console.error("Admin order alert email failed:", err.message)
        );

        return ApiResponse.created(res, "Order placed successfully.", {
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                total: order.total,
                customer: order.customer,
                items: order.items,
                status: order.status,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get order history for logged-in user
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .lean();

        return ApiResponse.success(res, "Orders retrieved successfully.", {
            orders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single order details by ID or orderNumber
 * @route   GET /api/orders/:id
 * @access  Public (Guest lookup) / Private
 */
const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        let query = {};
        if (id.startsWith("KCTTW-")) {
            query = { orderNumber: id };
        } else {
            query = { _id: id };
        }

        const order = await Order.findOne(query);
        if (!order) {
            return next(ApiError.notFound("Order not found with the provided identifier."));
        }

        return ApiResponse.success(res, "Order details retrieved.", { order });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Admin: Get all orders with pagination
 * @route   GET /api/orders
 * @access  Private / Admin
 */
const getAllOrders = async (req, res, next) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const totalOrders = await Order.countDocuments(filter);
        const orders = await Order.find(filter)
            .populate("user", "fullName email phone")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return ApiResponse.success(res, "All orders retrieved.", {
            orders,
            pagination: {
                total: totalOrders,
                page,
                pages: Math.ceil(totalOrders / limit),
                limit
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Admin: Update order or payment status
 * @route   PATCH /api/orders/:id/status
 * @access  Private / Admin
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus, paymentReference } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return next(ApiError.notFound("Order not found."));
        }

        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (paymentReference) order.paymentReference = paymentReference;

        await order.save();

        return ApiResponse.success(res, "Order status updated successfully.", { order });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};
