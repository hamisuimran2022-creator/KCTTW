const ApiError = require("../utils/apiError");

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = err;

    // Handle invalid ObjectId from Mongoose
    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value}`;
        error = ApiError.notFound(message);
    }

    // Handle Mongoose duplicate key error (code 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        const message = `An account with this ${field} already exists.`;
        error = ApiError.conflict(message);
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        error = ApiError.badRequest(message);
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        error = ApiError.unauthorized("Invalid token. Please log in again.");
    }
    if (err.name === "TokenExpiredError") {
        error = ApiError.unauthorized("Session expired. Please log in again.");
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    if (process.env.NODE_ENV !== "production" && statusCode === 500) {
        console.error("🔥 SERVER ERROR:", err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {})
    });
};

module.exports = errorHandler;
