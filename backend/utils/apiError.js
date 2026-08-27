class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static badRequest(msg = "Bad Request") {
        return new ApiError(400, msg);
    }

    static unauthorized(msg = "Unauthorized access") {
        return new ApiError(401, msg);
    }

    static forbidden(msg = "Forbidden access") {
        return new ApiError(403, msg);
    }

    static notFound(msg = "Resource not found") {
        return new ApiError(404, msg);
    }

    static conflict(msg = "Conflict: Resource already exists") {
        return new ApiError(409, msg);
    }

    static internal(msg = "Internal server error") {
        return new ApiError(500, msg, false);
    }
}

module.exports = ApiError;
