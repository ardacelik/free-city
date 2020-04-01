const express = require("express");
const {
    getResources,
    getResource,
    addResource,
    editResource,
    createResource,
    updateResource,
    deleteResource
} = require("../controllers/resources");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router
    .route("/")
    .get(getResources)
    //.post(protect, authorize("publisher", "admin"), createResource);
    .post(createResource);

router.route("/add").get(addResource);

router.route("/edit/:id").get(editResource);

router
    .route("/:id")
    .get(getResource)
    // .put(protect, authorize("publisher", "admin"), updateResource)
    .put(updateResource)
    //.delete(protect, authorize("publisher", "admin"), deleteResource);
    .delete(deleteResource);

module.exports = router;
