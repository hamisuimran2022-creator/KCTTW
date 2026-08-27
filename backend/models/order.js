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
            min: [0, "Price cannot be negative"]
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
            default: 1
        },
        color: {
            type: String,
            default: "Default",
            trim: true
        },
        size: {
            type: String,
            default: "Standard",
            trim: true
        },
        image: {
            type: String,
            default: ""
        },
        itemTotal: {
            type: Number,
            required: true
        }
    },
    { _id: false }
);

const customerInfoSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
            required: true,
            index: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false // Nullable to support guest checkout
        },
        customer: {
            type: customerInfoSchema,
            required: true
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => Array.isArray(items) && items.length > 0,
                message: "Order must contain at least one item"
            }
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0
        },
        shippingFee: {
            type: Number,
            default: 0,
            min: 0
        },
        total: {
            type: Number,
            required: true,
            min: 0
        },
        shippingAddress: {
            street: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            country: { type: String, default: "Nigeria" },
            postalCode: { type: String, default: "" }
        },
        paymentMethod: {
            type: String,
            enum: ["korapay", "paystack", "bank_transfer", "whatsapp", "card", "cash_on_delivery"],
            default: "korapay"
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed", "Refunded"],
            default: "Pending"
        },
        paymentReference: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
        },
        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// Generate human-friendly order number before saving
orderSchema.pre("validate", function (next) {
    if (!this.orderNumber) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.floor(1000 + Math.random() * 9000);
        this.orderNumber = `KCTTW-${timestamp}-${random}`;
    }
    next();
});

module.exports = mongoose.model("Order", orderSchema);