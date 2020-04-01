const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const resources = require("./routes/resources");
const auth = require("./routes/auth");

const app = express();

// Handlebars setup
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body parser
app.use(express.json());

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

app.use(errorHandler);

app.use(express.static("public"));

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
