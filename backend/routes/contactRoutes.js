const express = require("express");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const { sendContactEmail } = require("../services/emailService");

const router = express.Router();

/**
 * @desc    Submit contact message and notify admin
 * @route   POST /api/contact
 * @access  Public
 */
router.post("/", async (req, res, next) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return next(ApiError.badRequest("Please provide your name, email, and message."));
        }

        // Send email to store owner
        sendContactEmail({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : "",
            subject: subject ? subject.trim() : "General Inquiry",
            message: message.trim()
        }).catch((err) => {
            console.error("Failed to send contact inquiry email:", err.message);
        });

        return ApiResponse.success(res, "Thank you for your message! Our concierge team will reach out promptly.");
    } catch (error) {
        next(error);
    }
});

module.exports = router;
