const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
    street: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "Nigeria" },
    postalCode: { type: String, trim: true, default: "" }
}, { _id: false });

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: [2, "Full name must be at least 2 characters"]
        },
        email: {
            type: String,
            required: [true, "Email address is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
                "Please enter a valid email address"
            ],
            index: true
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false // Excluded from queries by default for security
        },
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer"
        },
        address: {
            type: addressSchema,
            default: () => ({})
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving if modified
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Return safe public profile without sensitive data
userSchema.methods.toPublicProfile = function () {
    return {
        id: this._id,
        fullName: this.fullName,
        email: this.email,
        phone: this.phone,
        role: this.role,
        address: this.address,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model("User", userSchema);
