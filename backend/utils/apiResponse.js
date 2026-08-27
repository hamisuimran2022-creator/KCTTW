class ApiResponse {
    static success(res, message = "Success", data = null, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            ...(data !== null ? { data } : {})
        });
    }

    static created(res, message = "Resource created successfully", data = null) {
        return ApiResponse.success(res, message, data, 201);
    }

    static error(res, message = "An error occurred", statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            ...(errors ? { errors } : {})
        });
    }
}

module.exports = ApiResponse;
