const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

/* ================================
   MIDDLEWARE
================================ */

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   MONGODB CONNECTION
================================ */

let connectionPromise = null;

async function connectMongoDB() {

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured in Vercel.");
    }

    if (!connectionPromise) {

        connectionPromise = mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 10000
            }
        );

    }

    try {

        await connectionPromise;

        console.log("MongoDB connected.");

    } catch (error) {

        connectionPromise = null;

        console.error(
            "MongoDB connection error:",
            error.message
        );

        throw error;
    }
}

/* ================================
   HEALTH CHECK
================================ */

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "KCTTW backend is running."
    });

});

/* ================================
   DATABASE TEST
================================ */

app.get("/api/test-db", async (req, res) => {

    try {

        await connectMongoDB();

        res.status(200).json({
            success: true,
            message: "MongoDB connection is working."
        });

    } catch (error) {

        console.error("DATABASE TEST ERROR:", error);

        res.status(500).json({
            success: false,
            message: "MongoDB connection failed.",
            error: error.message
        });

    }

});

/* ================================
   AUTH ROUTES
================================ */

app.use("/api/auth", async (req, res, next) => {

    try {

        await connectMongoDB();

        next();

    } catch (error) {

        console.error(
            "AUTH DATABASE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Database connection failed.",
            error: error.message
        });

    }

}, authRoutes);

/* ================================
   404
================================ */

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found."
    });

});

/* ================================
   ERROR HANDLER
================================ */

app.use((error, req, res, next) => {

    console.error(
        "SERVER ERROR:",
        error
    );

    res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message
    });

});

/* ================================
   VERCEL EXPORT
================================ */

module.exports = app;
