const express = require("express");
const {
    initializeKorapay,
    verifyKorapay,
    handleWebhook
} = require("../controllers/paymentController");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Korapay checkout routes
router.post("/korapay/initialize", optionalAuth, initializeKorapay);
router.get("/korapay/verify/:reference", verifyKorapay);
router.post("/korapay/webhook", handleWebhook);

module.exports = router;
