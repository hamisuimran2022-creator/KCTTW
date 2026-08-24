
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

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

app.use(
    express.urlencoded({
        extended: true
    })
);


/*
========================================================
MONGODB CONNECTION
========================================================
*/

let mongoConnection = null;

async function connectMongoDB() {

    // Already connected
    if (mongoose.connection.readyState === 1) {
        return;
    }

    // Check MONGO_URI
    if (!process.env.MONGO_URI) {
        throw new Error(
            "MONGO_URI environment variable is missing."
        );
    }

    // Create connection only once
    if (!mongoConnection) {

        mongoConnection = mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 10000
            }
        );

    }

    try {

        await mongoConnection;

        console.log(
            "MongoDB connected successfully."
        );

    } catch (error) {

        // Allow another connection attempt
        mongoConnection = null;

        console.error(
            "MongoDB connection failed:"
        );

        console.error(
            "NAME:",
            error.name
        );

        console.error(
            "MESSAGE:",
            error.message
        );

        throw error;
    }
}


/*
========================================================
BASIC SERVER TEST
========================================================
*/

app.get("/", (req, res) => {

    return res.status(200).json({
        success: true,
        message: "KCTTW backend is running."
    });

});


/*
========================================================
MONGODB TEST ROUTE
========================================================

Open:

https://backend-koguna1.vercel.app/api/test-db

========================================================
*/

app.get("/api/test-db", async (req, res) => {

    try {

        await connectMongoDB();

        return res.status(200).json({

            success: true,

            message:
                "MongoDB connection is working.",

            database:
                mongoose.connection.name,

            readyState:
                mongoose.connection.readyState

        });

    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "MONGODB TEST ERROR"
        );

        console.error(
            "NAME:",
            error.name
        );

        console.error(
            "MESSAGE:",
            error.message
        );

        console.error(
            "================================="
        );

        return res.status(500).json({

            success: false,

            message:
                "MongoDB connection failed.",

            error:
                error.message,

            name:
                error.name

        });

    }

});


/*
========================================================
DATABASE MIDDLEWARE
========================================================

Every API request below this point will first
connect to MongoDB.

========================================================
*/

app.use(async (req, res, next) => {

    try {

        await connectMongoDB();

        next();

    } catch (error) {

        console.error(
            "DATABASE ERROR:"
        );

        console.error(
            "NAME:",
            error.name
        );

        console.error(
            "MESSAGE:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Database connection failed.",

            error:
                error.message,

            name:
                error.name

        });

    }

});


/*
========================================================
AUTH ROUTES
========================================================

REGISTER:
POST /api/auth/register

LOGIN:
POST /api/auth/login

========================================================
*/

app.use(
    "/api/auth",
    authRoutes
);


/*
========================================================
404 ROUTE
========================================================
*/

app.use((req, res) => {

    return res.status(404).json({

        success: false,

        message:
            "Route not found."

    });

});


/*
========================================================
GLOBAL ERROR HANDLER
========================================================
*/

app.use(
    (error, req, res, next) => {

        console.error(
            "SERVER ERROR:"
        );

        console.error(
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal server error.",

            error:
                error.message

        });

    }
);


/*
========================================================
VERCEL EXPORT
========================================================

DO NOT USE app.listen() HERE.

========================================================
*/

module.exports = app;
```
