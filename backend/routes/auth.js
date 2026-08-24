const express = require("express");

const router = express.Router();

/*
========================================================
TEMPORARY REGISTER TEST
POST /api/auth/register
========================================================
*/

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


        /*
        ====================================================
        CHECK REQUIRED FIELDS
        ====================================================
        */

        if (
            !fullName ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill in all fields."

            });

        }


        /*
        ====================================================
        TEMPORARY SUCCESS
        ====================================================
        */

        return res.status(201).json({

            success: true,

            message:
                "Registration request received successfully.",

            user: {

                fullName:
                    fullName,

                email:
                    email,

                phone:
                    phone

            }

        });

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while creating account."

        });

    }

});


/*
========================================================
LOGIN TEST
========================================================
*/

router.post("/login", async (req, res) => {

    return res.status(200).json({

        success: true,

        message:
            "Login endpoint is working."

    });

});


module.exports = router;
