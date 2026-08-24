const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const router = express.Router();


// ======================================================
// CREATE ORDER
// POST /api/orders
// ======================================================

router.post("/", async (req, res) => {

    try {

        const {
            userId,
            customerName,
            customerEmail,
            customerPhone,
            items,
            total,
            shippingAddress,
            paymentMethod
        } = req.body;


        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }


        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }


        if (!customerName || !customerEmail || !customerPhone) {
            return res.status(400).json({
                success: false,
                message: "Customer information is required"
            });
        }


        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one item"
            });
        }


        if (typeof total !== "number" || total < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid order total"
            });
        }


        // -----------------------------
        // CREATE ORDER
        // -----------------------------

        const order = new Order({

            userId,

            customerName,

            customerEmail,

            customerPhone,

            items,

            total,

            shippingAddress:
                shippingAddress || "",

            paymentMethod:
                paymentMethod || "paystack",

            status: "Pending",

            paymentStatus: "Pending"

        });


        // -----------------------------
        // SAVE TO MONGODB
        // -----------------------------

        await order.save();


        // -----------------------------
        // SUCCESS RESPONSE
        // -----------------------------

        return res.status(201).json({

            success: true,

            message: "Order Created Successfully",

            order: {

                id: order._id,

                userId: order.userId,

                customerName: order.customerName,

                customerEmail: order.customerEmail,

                customerPhone: order.customerPhone,

                items: order.items,

                total: order.total,

                shippingAddress:
                    order.shippingAddress,

                paymentMethod:
                    order.paymentMethod,

                status:
                    order.status,

                paymentStatus:
                    order.paymentStatus,

                createdAt:
                    order.createdAt

            }

        });

    } catch (error) {

        console.error(
            "Create order error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to create order",

            error:
                error.message

        });

    }

});



module.exports = router;