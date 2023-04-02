const prisma = require("../prisma");
const catchAsync = require("../utilities/catchAsync");
const { validateBody } = require("./../utilities/bodyValidation");


exports.signUp = catchAsync(async (req, res, next) => {
    validateBody(req.body, {
        type: "object",
        properties: {
            email: {type: "string"},
            password: {type: "string", format: "password"}
        },
        required: ["email"],
        additionalProperties: false
    });

    const users = await prisma.user.findMany();

    res.status(200).json({
        status: true,
        message: req.body,
        users
    })
});