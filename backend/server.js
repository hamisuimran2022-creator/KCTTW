const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

/*
========================================================
MIDDLEWARE
========================================================
*/

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
========================================================
MONGODB CONNECTION
========================================================
*/

let isConnecting = false;

async function connectMongoDB() {

    // Already connected
    if (mongoose.connection.readyState === 1) {
        return;
    }

    // Connection is already being established
    if (isConnecting) {
        while (isConnecting) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (mongoose.connection.readyState === 1) {
            return;
        }
    }

    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        throw new Error("MONGO_URI is not configured in Vercel.");
    }

    isConnecting = true;

    try {

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB connected successfully.");

    } catch (error) {

        console.error(
            "MongoDB connection error:",
            error.message
        );

        throw error;

    } finally {

        isConnecting = false;

    }
}

/*
========================================================
DATABASE MIDDLEWARE
========================================================
*/

app.use(async (req, res, next) => {

    try {

        await connectMongoDB();

        next();

    } catch (error) {

        console.error(
            "DATABASE CONNECTION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Database connection failed.",
            error:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : error.message
        });

    }

});

/*
========================================================
TEST ROUTE
========================================================
*/

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "KCTTW backend is running."
    });

});

/*
========================================================
AUTH ROUTES
========================================================
*/

app.use("/api/auth", authRoutes);

/*
========================================================
404
========================================================
*/

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found."
    });

});

/*
========================================================
ERROR HANDLER
========================================================
*/

app.use((error, req, res, next) => {

    console.error(
        "SERVER ERROR:",
        error
    );

    res.status(500).json({
        success: false,
        message: "Internal server error."
    });

});

/*
========================================================
VERCEL EXPORT
========================================================
*/

module.exports = app;
