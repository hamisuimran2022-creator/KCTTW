const Order = require("../models/Order");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const { initializePayment, verifyPayment, verifyWebhookSignature } = require("../services/korapayService");
const { sendOrderConfirmationEmail, sendAdminOrderAlertEmail } = require("../services/emailService");

/**
 * @desc    Initialize Korapay Payment Session
 * @route   POST /api/payments/korapay/initialize
 * @access  Public
 */
const initializeKorapay = async (req, res, next) => {
    try {
        const { orderId, redirectUrl } = req.body;

        if (!orderId) {
            return next(ApiError.badRequest("Order ID or order number is required."));
        }

        let query = {};
        if (typeof orderId === "string" && orderId.startsWith("KCTTW-")) {
            query = { orderNumber: orderId };
        } else {
            query = { _id: orderId };
        }

        const order = await Order.findOne(query);
        if (!order) {
            return next(ApiError.notFound("Order not found."));
        }

        if (order.paymentStatus === "Paid") {
            return next(ApiError.badRequest("This order has already been paid for."));
        }

        const host = req.get("host");
        const protocol = req.protocol;
        const defaultRedirect = `${protocol}://${host}/payment/verify`;
        const notificationUrl = `${protocol}://${host}/api/payments/korapay/webhook`;

        const paymentInit = await initializePayment({
            orderNumber: order.orderNumber,
            amount: order.total,
            customer: {
                name: order.customer.name,
                email: order.customer.email
            },
            redirectUrl: redirectUrl || defaultRedirect,
            notificationUrl
        });

        // Store reference on order
        order.paymentReference = paymentInit.data.reference;
        order.paymentMethod = "korapay";
        await order.save();

        return ApiResponse.success(res, "Korapay checkout session initialized successfully.", {
            reference: paymentInit.data.reference,
            checkout_url: paymentInit.data.checkout_url,
            amount: paymentInit.data.amount,
            currency: paymentInit.data.currency,
            orderNumber: order.orderNumber
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Verify / Resolve Korapay Payment Transaction
 * @route   GET /api/payments/korapay/verify/:reference
 * @access  Public
 */
const verifyKorapay = async (req, res, next) => {
    try {
        const { reference } = req.params;
        const { order_id } = req.query;

        if (!reference) {
            return next(ApiError.badRequest("Payment reference is required."));
        }

        // Find order by paymentReference or orderNumber or order_id
        let order = await Order.findOne({
            $or: [
                { paymentReference: reference },
                ...(order_id ? [{ orderNumber: order_id }, { _id: order_id.length === 24 ? order_id : undefined }].filter(Boolean) : [])
            ]
        });

        const verification = await verifyPayment(reference);

        if (verification.success && verification.status === "success") {
            if (order) {
                const wasAlreadyPaid = order.paymentStatus === "Paid";
                order.paymentStatus = "Paid";
                order.status = "Processing";
                order.paymentReference = reference;
                await order.save();

                // Send confirmation email once
                if (!wasAlreadyPaid) {
                    sendOrderConfirmationEmail(order).catch((err) =>
                        console.error("Failed to send order email upon Korapay verification:", err.message)
                    );
                    sendAdminOrderAlertEmail(order).catch((err) =>
                        console.error("Failed to send admin order alert:", err.message)
                    );
                }
            }

            return ApiResponse.success(res, "Payment verified successfully!", {
                status: "success",
                reference,
                order: order ? {
                    orderNumber: order.orderNumber,
                    total: order.total,
                    paymentStatus: order.paymentStatus,
                    status: order.status,
                    customer: order.customer,
                    items: order.items,
                    createdAt: order.createdAt
                } : null
            });
        } else {
            if (order) {
                order.paymentStatus = "Failed";
                await order.save();
            }
            return res.status(400).json({
                success: false,
                message: "Payment could not be verified.",
                status: verification.status || "failed"
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Korapay Webhook Listener
 * @route   POST /api/payments/korapay/webhook
 * @access  Public (Signature verified)
 */
const handleWebhook = async (req, res) => {
    try {
        const signature = req.headers["x-korapay-signature"];
        const isValid = verifyWebhookSignature(signature, JSON.stringify(req.body));

        if (!isValid) {
            console.warn("⚠️ Invalid Korapay webhook signature");
            return res.status(400).send("Invalid signature");
        }

        const { event, data } = req.body;
        console.log(`🔔 [KORAPAY WEBHOOK] Event: ${event} | Reference: ${data && data.reference}`);

        if (event === "charge.success" && data) {
            const reference = data.reference;
            const order = await Order.findOne({
                $or: [{ paymentReference: reference }, { orderNumber: data.reference }]
            });

            if (order && order.paymentStatus !== "Paid") {
                order.paymentStatus = "Paid";
                order.status = "Processing";
                await order.save();

                sendOrderConfirmationEmail(order).catch((err) =>
                    console.error("Order confirmation email failed:", err.message)
                );
            }
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error("Webhook processing error:", error.message);
        return res.status(500).json({ error: "Webhook handling failed" });
    }
};

module.exports = {
    initializeKorapay,
    verifyKorapay,
    handleWebhook
};
