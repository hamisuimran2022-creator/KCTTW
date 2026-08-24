const express = require("express");

const router = express.Router();

router.post("/register", async (req, res) => {

    try {

        console.log("REGISTER REQUEST RECEIVED");
        console.log("BODY:", req.body);

        const {
            fullName,
            email,
            phone,
            password
        } = req.body;

        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        return res.status(201).json({
            success: true,
            message: "Registration request received successfully.",
            user: {
                fullName,
                email,
                phone
            }
        });

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while creating account."
        });

    }

});

router.post("/login", async (req, res) => {

    return res.status(200).json({
        success: true,
        message: "Login endpoint is working."
    });

});

module.exports = router;
