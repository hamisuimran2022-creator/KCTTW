const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const healthRoutes = require("./routes/healthRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const errorHandler = require("./middleware/error");
const ApiError = require("./utils/apiError");

const app = express();

/* =========================================================
   SECURITY & UTILITY MIDDLEWARE
========================================================= */
app.use(
    helmet({
        contentSecurityPolicy: false, // Allows flexible asset loading across CDNs
        crossOriginEmbedderPolicy: false
    })
);

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* =========================================================
   DATABASE INITIALIZATION MIDDLEWARE
========================================================= */
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failure on request:", error.message);
        next();
    }
});

/* =========================================================
   API ROUTES
========================================================= */
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);



// Root greeting
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "KCTTW — Kamba Collection To The World API is live.",
        docs: "/api/health"
    });
});

/* =========================================================
   404 HANDLER
========================================================= */
app.use((req, res, next) => {
    next(ApiError.notFound(`Endpoint not found: ${req.method} ${req.originalUrl}`));
});

/* =========================================================
   CENTRALIZED ERROR HANDLER
========================================================= */
app.use(errorHandler);

/* =========================================================
   SERVER START (LOCAL DEV)
========================================================= */
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
    app.listen(PORT, async () => {
        console.log(`\n✨ ========================================`);
        console.log(`🚀 KCTTW API Server running on port ${PORT}`);
        console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
        console.log(`✨ ========================================\n`);
        await connectDB();
    });
}

module.exports = app;
