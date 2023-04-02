const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");

const prisma = require("./../prisma/index");

router.get('/', async (req, res, next) => {
    res.status(200).json({
        status: true,
        message: "Hiii"
    })

});

router.post('/sign-up', authController.signUp);

module.exports = router;