const prisma = require("../prisma");
const catchAsync = require("../utilities/catchAsync");
const { validateBody } = require("./../utilities/bodyValidation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../utilities/appError");

const signToken = data => {
    
    return jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.signUp = catchAsync(async (req, res, next) => {
    // Body Validation usng AJV library
    validateBody(req.body, {
        type: "object",
        properties: {
            email: {type: "string", format: "email"},
            password: {type: "string", format: "password"}
        },
        required: ["email", "password"],
        additionalProperties: false
    });

    
    const user = await prisma.user.create({
        data: req.body,
        select: {id: true, email: true}
    });

    res.status(200).json({
        status: true,
        message: "User successfully registered",
        user
    })
});

exports.login = catchAsync(async (req, res, next) => {
    console.log(req.body);
    // Body validation using AJV library
    validateBody(req.body, {
        type: "object",
        properties: {
            email: {type: "string", format: "email"},
            password: {type: "string", format: "password"}
        },
        required: ["email", "password"],
        additionalProperties: false
    });
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        select: { password: true }
    })
    if(!user) throw new AppError(`No such user exists with email address ${email}.`);

    // Verify password
    const is_valid_password = bcrypt.compareSync(password, user.password);
    if(!is_valid_password) throw new AppError('Invalid password');

    // Generating token
    const token = signToken(user);

    res.status(200).json({
        status: true,
        message: "User successfully login",
        token
    })
});