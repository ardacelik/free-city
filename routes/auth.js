const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { register, login, getMe } = require("../controllers/auth");
const { ensureAuthencticated } = require("../helpers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.get("/register", register);
router.get("/login", login);
// router.post("/register", register);
router.get("/me", protect, getMe);
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/resources",
        failureRedirect: "/auth/login",
        failureFlash: true
    })(req, res, next);
});
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("sucess_msg", "You are logged out");
    res.redirect("/auth/login");
});

module.exports = router;
