
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

/*
========================================================
BASIC CONFIGURATION
========================================================
*/

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/*
========================================================
MONGODB CONNECTION
========================================================
*/

let isConnected = false;

async function connectDB() {

    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        throw new Error(
            "MONGO_URI environment variable is missing."
        );
    }

    try {

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000
        });

        isConnected = true;

        console.log(
            "MongoDB connected successfully:",
            mongoose.connection.name
        );

    } catch (error) {

        isConnected = false;

        console.error(
            "MONGODB CONNECTION ERROR:",
            error.message
        );

        throw error;
    }
}


/*
========================================================
HEALTH CHECK
========================================================
*/

app.get("/", async (req, res) => {

    return res.status(200).json({
        success: true,
        message: "KCTTW backend is running."
    });

});


/*
========================================================
DATABASE TEST
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
                error.message
            );

            return res.status(500).json({

                success: false,

                message:
                    "Database connection failed.",

                error:
                    error.message

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

        message: "Route not found."

    });

});


/*
========================================================
GLOBAL ERROR HANDLER
========================================================
*/

app.use((error, req, res, next) => {

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

});


/*
========================================================
VERCEL EXPORT
========================================================
*/

module.exports = app;


/*
========================================================
LOCAL DEVELOPMENT
========================================================
*/

if (require.main === module) {

    const PORT =
        process.env.PORT || 5000;

    app.listen(PORT, () => {

        console.log(
            `KCTTW backend running on port ${PORT}`
        );

    });

}
```
