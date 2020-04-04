const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const { ensureAuthencticated } = require("../helpers/auth");

const router = express.Router();

const User = require("../models/User");

// @desc    Login user
// @route   GET /
// @access  Public
router.get("/login", (req, res, next) => {
    res.render("users/login");
});

// @desc    Register user
// @route   GET /register
// @access  Public
router.get("/register", (req, res, next) => {
    res.render("users/register");
});

// @desc    Login user
// @route   POST /register
// @access  Public
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/resources",
        failureRedirect: "/auth/login",
        failureFlash: true
    })(req, res, next);
});

// @desc    Create user
// @route   POST /register
// @access  Public
router.post("/register", (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({ text: "Passwords do not match" });
    }
    if (req.body.password.length < 4) {
        errors.push({ text: "Passwords must be at least 4 characters" });
    }
    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                req.flash("error_msg", "Email already registered");
                res.redirect("/auth/register");
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    "success_msg",
                                    "You are now registered and can log in"
                                );
                                res.redirect("/auth/login");
                            })
                            .catch(err => {
                                console.log(err);
                                return;
                            });
                    });
                });
            }
        });
    }
});

// @desc    Logout user
// @route   GET /logout
// @access  Private
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/auth/login");
});

module.exports = router;
