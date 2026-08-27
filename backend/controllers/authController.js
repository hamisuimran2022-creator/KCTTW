const User = require("../models/User");
const Order = require("../models/Order");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const { generateToken } = require("../utils/jwt");
const { sendWelcomeEmail } = require("../services/emailService");

/**
 * @desc    Register a new customer account
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        const { fullName, email, phone, password } = req.body;

        if (!fullName || !email || !phone || !password) {
            return next(ApiError.badRequest("Please provide full name, email, phone number, and password."));
        }

        const cleanEmail = email.trim().toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return next(ApiError.conflict("An account with this email address already exists."));
        }

        // Create new user (password is automatically hashed by Mongoose pre-save hook)
        const user = await User.create({
            fullName: fullName.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            password
        });

        // Send welcome email asynchronously
        sendWelcomeEmail(user).catch((err) =>
            console.error("Welcome email failed:", err.message)
        );

        // Generate JWT Token
        const token = generateToken({ id: user._id, role: user.role, email: user.email });

        return ApiResponse.created(res, "Account created successfully.", {
            token,
            user: user.toPublicProfile()
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login customer or admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(ApiError.badRequest("Please provide both email and password."));
        }

        const cleanEmail = email.trim().toLowerCase();

        // Find user and explicitly select password (which is select: false)
        const user = await User.findOne({ email: cleanEmail }).select("+password");
        if (!user) {
            return next(ApiError.unauthorized("Invalid email or password credentials."));
        }

        if (!user.isActive) {
            return next(ApiError.forbidden("This account has been deactivated. Please contact support."));
        }

        // Check password match
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(ApiError.unauthorized("Invalid email or password credentials."));
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Generate JWT Token
        const token = generateToken({ id: user._id, role: user.role, email: user.email });

        return ApiResponse.success(res, "Login successful. Welcome back!", {
            token,
            user: user.toPublicProfile()
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get currently authenticated user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
    try {
        const user = req.user;
        const totalOrders = await Order.countDocuments({ user: user._id });
        const recentOrders = await Order.find({ user: user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        return ApiResponse.success(res, "User profile retrieved successfully.", {
            user: user.toPublicProfile(),
            stats: {
                totalOrders
            },
            recentOrders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update customer profile information
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
    try {
        const user = req.user;
        const { fullName, phone, address } = req.body;

        if (fullName) user.fullName = fullName.trim();
        if (phone) user.phone = phone.trim();
        if (address && typeof address === "object") {
            user.address = {
                ...user.address,
                ...address
            };
        }

        await user.save();

        return ApiResponse.success(res, "Profile updated successfully.", {
            user: user.toPublicProfile()
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Change customer password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return next(ApiError.badRequest("Please provide current and new passwords."));
        }

        if (newPassword.length < 6) {
            return next(ApiError.badRequest("New password must be at least 6 characters."));
        }

        const user = await User.findById(req.user._id).select("+password");
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return next(ApiError.badRequest("Current password does not match our records."));
        }

        user.password = newPassword;
        await user.save();

        return ApiResponse.success(res, "Password updated successfully.");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
    changePassword
};
