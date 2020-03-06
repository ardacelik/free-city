const express = require("express");
const {
    getResources,
    getResource,
    createResource,
    updateResource,
    deleteResource
} = require("../controllers/resources");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router
    .route("/")
    .get(getResources)
    .post(protect, authorize("publisher", "admin"), createResource);

router
    .route("/:id")
    .get(getResource)
    .put(protect, authorize("publisher", "admin"), updateResource)
    .delete(protect, authorize("publisher", "admin"), deleteResource);

module.exports = router;
