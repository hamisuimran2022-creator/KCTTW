const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        image: {
            type: String,
            default: ""
        },

        size: {
            type: String,
            default: ""
        },

        color: {
            type: String,
            default: ""
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        customerName: {
            type: String,
            required: true,
            trim: true
        },

        customerEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        customerPhone: {
            type: String,
            required: true,
            trim: true
        },

        items: {
            type: [orderItemSchema],
            required: true,

            validate: {
                validator: function (items) {
                    return items && items.length > 0;
                },

                message: "Order must contain at least one item"
            }
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        shippingAddress: {
            type: String,
            default: ""
        },

        paymentMethod: {
            type: String,
            enum: [
                "paystack",
                "bank",
                "ussd"
            ],
            default: "paystack"
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ],
            default: "Pending"
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Failed",
                "Refunded"
            ],
            default: "Pending"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Order",
    orderSchema
);