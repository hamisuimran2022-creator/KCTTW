const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

/*
========================================================
BASIC CONFIGURATION
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

let mongoPromise = null;

async function connectDB() {

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!process.env.MONGO_URI) {
        throw new Error(
            "MONGO_URI environment variable is missing."
        );
    }

    if (!mongoPromise) {

        mongoPromise = mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 10000,
                connectTimeoutMS: 10000
            }
        );

    }

    try {

        await mongoPromise;

        console.log(
            "MongoDB connected:",
            mongoose.connection.name
        );

        return mongoose.connection;

    } catch (error) {

        mongoPromise = null;

        console.error(
            "MONGODB CONNECTION ERROR:"
        );

        console.error(
            "Name:",
            error.name
        );

        console.error(
            "Message:",
            error.message
        );

        throw error;

    }
}


/*
========================================================
DATABASE TEST ROUTE
========================================================
*/

app.get("/api/test-db", async (req, res) => {

    try {

        await connectDB();

        return res.status(200).json({

            success: true,

            message:
                "MongoDB connection is working.",

            database:
                mongoose.connection.name

        });

    } catch (error) {

        console.error(
            "MONGODB TEST ERROR:",
            error
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
ROOT ROUTE
========================================================
*/

app.get("/", async (req, res) => {

    res.status(200).json({

        success: true,

        message:
            "KCTTW backend is running."

    });

});


/*
========================================================
AUTH ROUTES
========================================================
*/

app.use(
    "/api/auth",
    async (req, res, next) => {

        try {

            await connectDB();

            next();

        } catch (error) {

            console.error(
                "AUTH DATABASE ERROR:",
                error
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

    },
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
            "SERVER ERROR:",
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
*/

module.exports = app;
