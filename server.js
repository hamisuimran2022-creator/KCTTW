const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

/* =========================
   CORS
========================= */

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

/* =========================
   BODY PARSER
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   MONGODB CONNECTION
========================= */

let mongoPromise = null;

async function connectMongoDB() {

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing.");
    }

    if (!mongoPromise) {
        mongoPromise = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });
    }

    try {

        await mongoPromise;

        console.log("MongoDB connected.");

    } catch (error) {

        mongoPromise = null;

        console.error("MongoDB connection error:", error);

        throw error;
    }
}

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "KCTTW backend is running."
    });

});

/* =========================
   DATABASE MIDDLEWARE
========================= */

app.use(async (req, res, next) => {

    try {

        await connectMongoDB();

        next();

    } catch (error) {

        console.error("DATABASE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Database connection failed."
        });

    }

});

/* =========================
   AUTH ROUTES
========================= */

app.use("/api/auth", authRoutes);

/* =========================
   TEST REGISTER ROUTE
========================= */

app.get("/api/auth/test", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Auth route is working."
    });

});

/* =========================
   404
========================= */

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found.",
        path: req.originalUrl,
        method: req.method
    });

});

/* =========================
   ERROR HANDLER
========================= */

app.use((error, req, res, next) => {

    console.error("SERVER ERROR:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error."
    });

});

/* =========================
   VERCEL
========================= */

module.exports = app;
