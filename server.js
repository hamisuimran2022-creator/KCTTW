const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

const PORT = 5000;

/*
========================================================
MIDDLEWARE
========================================================
*/

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/*
========================================================
TEST ROUTE
========================================================
*/

app.get("/", (req, res) => {
    res.json({
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
MONGODB
========================================================
*/

mongoose.connect(process.env.MONGO_URI)
    .then(() => {

        console.log("MongoDB connected successfully.");

        app.listen(PORT, () => {

            console.log(
                `KCTTW server running on http://localhost:${PORT}`
            );

        });

    })
    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error
        );

    });