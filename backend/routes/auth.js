
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

        console.log("=================================");
        console.log("REGISTER REQUEST RECEIVED");
        console.log("BODY:", req.body);
        console.log("=================================");

        const {
            fullName,
            email,
            phone,
            password
        } = req.body || {};

        /*
        --------------------------------------------
        CHECK REQUIRED FIELDS
        --------------------------------------------
        */

        if (!fullName || !email || !phone || !password) {

            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });

        }

        /*
        --------------------------------------------
        CLEAN DATA
        --------------------------------------------
        */

        const cleanFullName = String(fullName).trim();
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanPhone = String(phone).trim();
        const cleanPassword = String(password);

        /*
        --------------------------------------------
        VALIDATE PASSWORD
        --------------------------------------------
        */

        if (cleanPassword.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });

        }

        /*
        --------------------------------------------
        CHECK EMAIL
        --------------------------------------------
        */

        console.log("Checking existing user...");

        const existingUser = await User.findOne({
            email: cleanEmail
        });

        console.log(
            "Existing user:",
            existingUser ? "YES" : "NO"
        );

        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });

        }

        /*
        --------------------------------------------
        HASH PASSWORD
        --------------------------------------------
        */

        console.log("Hashing password...");

        const hashedPassword = await bcrypt.hash(
            cleanPassword,
            10
        );

        console.log("Password hashed successfully.");

        /*
        --------------------------------------------
        CREATE USER
        --------------------------------------------
        */

        console.log("Creating user in MongoDB...");

        const user = await User.create({

            fullName: cleanFullName,

            email: cleanEmail,

            phone: cleanPhone,

            password: hashedPassword,

            balance: 0,

            totalInvested: 0,

            totalProfit: 0

        });

        console.log(
            "USER CREATED SUCCESSFULLY:",
            user._id.toString()
        );

        /*
        --------------------------------------------
        SUCCESS
        --------------------------------------------
        */

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

        /*
        ========================================================
        IMPORTANT DEBUG INFORMATION
        ========================================================
        */

        console.error("=================================");
        console.error("REGISTER ERROR");
        console.error("NAME:", error.name);
        console.error("MESSAGE:", error.message);
        console.error("CODE:", error.code);
        console.error("STACK:", error.stack);
        console.error("=================================");

        /*
        --------------------------------------------
        DUPLICATE EMAIL
        --------------------------------------------
        */

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with this email already exists."

            });

        }

        /*
        --------------------------------------------
        MONGOOSE VALIDATION ERROR
        --------------------------------------------
        */

        if (error.name === "ValidationError") {

            return res.status(400).json({

                success: false,

                message:
                    "User validation failed.",

                error:
                    error.message

            });

        }

        /*
        --------------------------------------------
        TEMPORARY DEBUG RESPONSE
        --------------------------------------------
        */

        return res.status(500).json({

            success: false,

            message:
                "Server error while creating account.",

            error:
                error.message,

            errorName:
                error.name,

            errorCode:
                error.code || null

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
        } = req.body || {};

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }

        const cleanEmail =
            String(email).trim().toLowerCase();

        const user =
            await User.findOne({
                email: cleanEmail
            });

        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }

        const passwordMatch =
            await bcrypt.compare(
                String(password),
                user.password
            );

        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }

        return res.status(200).json({

            success: true,

            message:
                "Login successful.",

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

        console.error(
            "LOGIN ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while logging in.",

            error:
                error.message

        });

    }

});


module.exports = router;
```
