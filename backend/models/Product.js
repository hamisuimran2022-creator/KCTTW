const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        hex: { type: String, default: "#0a0a0a" }
    },
    { _id: false }
);

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [100, "Product name cannot exceed 100 characters"]
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: ["caps", "shirts", "round-necks", "accessories", "limited-drops"],
            default: "caps"
        },
        categoryName: {
            type: String,
            default: "Signature Collection"
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"]
        },
        originalPrice: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
            required: [true, "Product image is required"],
            default: "/images/cap.png"
        },
        cloudinaryPublicId: {
            type: String,
            default: ""
        },
        images: {
            type: [String],
            default: []
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            maxlength: [2000, "Description cannot exceed 2000 characters"]
        },
        colors: {
            type: [ColorSchema],
            default: [{ name: "Black", hex: "#0a0a0a" }]
        },
        sizes: {
            type: [String],
            default: ["Standard"]
        },
        tag: {
            type: String,
            default: "EXCLUSIVE"
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        inStock: {
            type: Boolean,
            default: true
        },
        stockQuantity: {
            type: Number,
            default: 50
        },
        rating: {
            type: Number,
            default: 5.0
        },
        reviewsCount: {
            type: Number,
            default: 48
        }
    },
    {
        timestamps: true
    }
);

// Auto-generate slug before save
ProductSchema.pre("save", function (next) {
    if (this.isModified("name") || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);
    }
    next();
});

module.exports = mongoose.model("Product", ProductSchema);
