const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const { ensureAuthencticated } = require("../helpers/auth");

// @desc    Login user
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    res.render("users/login");
    // const { email, password } = req.body;

    // // Validate email and password
    // if (!email || !password) {
    //     return next(
    //         new ErrorResponse("Please provide an email and password", 400)
    //     );
    // }

    // // Check for user
    // const user = await User.findOne({ email }).select("+password");

    // if (!user) {
    //     return next(new ErrorResponse("Invalid credentials", 401));
    // }

    // // Check if password matches
    // const isMatch = await user.matchPassword(password);

    // if (!isMatch) {
    //     return next(new ErrorResponse("Invalid credentials", 401));
    // }

    // sendTokenResponse(user, 200, res);
});

// @desc    Register user
// @route   POST /register
// @access  Public
// exports.register = asyncHandler(async (req, res, next) => {
//     console.log(req.body);
//     // const { name, email, password, role } = req.body;
//     // // Create user
//     // const user = await User.create({
//     //     name,
//     //     email,
//     //     password,
//     //     role
//     // });
//     // sendTokenResponse(user, 200, res);
// let errors = [];
// if (req.body.password != req.body.password2) {
//     errors.push({ text: "Passwords do not match" });
// }
// if (req.body.password.length < 4) {
//     errors.push({ text: "Passwords must be at least 4 characters" });
// }
// if (errors.length > 0) {
//     res.render("users/register", {
//         errors: errors,
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//         password2: req.body.password2
//     });
// } else {
//     res.send("passed");
//     // }
// });

// @desc    Register user
// @route   GET /register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    res.render("users/register");
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            token
        });
};

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});
