const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");
const ApiError = require("../utils/apiError");

/**
 * Protect routes: Requires valid Bearer JWT token
 */
const protect = async (req, res, next) => {
    try {
        let token = null;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(ApiError.unauthorized("Authentication required. Please log in."));
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) {
            return next(ApiError.unauthorized("Invalid or expired session token."));
        }

        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            return next(ApiError.unauthorized("User not found or account deactivated."));
        }

        req.user = user;
        next();
    } catch (error) {
        next(ApiError.unauthorized("Authentication failed: " + error.message));
    }
};

/**
 * Optional Auth: Attaches req.user if valid token provided, otherwise leaves null
 */
const optionalAuth = async (req, res, next) => {
    try {
        let token = null;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (token) {
            const decoded = verifyToken(token);
            if (decoded && decoded.id) {
                const user = await User.findById(decoded.id);
                if (user && user.isActive) {
                    req.user = user;
                }
            }
        }
    } catch (err) {
        // Silently continue as guest
    }
    next();
};

/**
 * Admin Only Authorization
 */
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return next(ApiError.forbidden("Admin privileges required."));
    }
    next();
};

module.exports = {
    protect,
    optionalAuth,
    adminOnly
};
