const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "KCTTW backend is running."
    });
});

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is missing.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;

    console.log("MongoDB connected successfully.");
}

// Authentication routes
app.use("/api/auth", async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("MongoDB connection error:", error);

        return res.status(500).json({
            success: false,
            message: "Database connection failed."
        });
    }
}, authRoutes);

module.exports = app;
