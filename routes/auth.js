const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();

/*
========================================================
REGISTER
POST /api/auth/register
========================================================
*/

router.post("/register", async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            password
        } = req.body;

        // Check required fields
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        // Clean email
        const cleanEmail = email.trim().toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Create user
        const user = await User.create({
            fullName: fullName.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            password: hashedPassword,

            balance: 0,
            totalInvested: 0,
            totalProfit: 0
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                balance: user.balance,
                totalInvested: user.totalInvested,
                totalProfit: user.totalProfit
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


/*
========================================================
LOGIN
POST /api/auth/login
========================================================
*/

router.post("/login", async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const cleanEmail =
            email.trim().toLowerCase();

        // Find user
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful.",

            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                balance: user.balance,
                totalInvested: user.totalInvested,
                totalProfit: user.totalProfit
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while logging in."
        });
    }
});


module.exports = router;