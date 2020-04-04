const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

require("./models/User");

// Route files
const resources = require("./routes/resources");
const auth = require("./routes/auth");

require("./config/passport")(passport);

const app = express();

// Handlebars setup
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body parser
app.use(express.json());

// Express session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// This middleware allows us to make a put request from the Edit Resource form
app.use(methodOverride("_method"));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Mount routers
app.use("/resources", resources);
app.use("/auth", auth);

// Home route
app.get("/", (req, res) => res.render("index"));

// About route
app.get("/about", (req, res) => res.render("about"));

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server and exit
    server.close(() => process.exit(1));
});
