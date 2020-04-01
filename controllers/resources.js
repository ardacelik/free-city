const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Resource = require("../models/Resource");

// @desc    Get all resources
// @route   GET /
// @access  Public
exports.getResources = asyncHandler(async (req, res, next) => {
    const resources = await Resource.find().sort({ createdAt: "desc" });

    // res.status(200).json({
    //     success: true,
    //     count: resources.length,
    //     data: resources
    // });

    res.render("resources/index", {
        resources
    });
});

// @desc    Page to add new resource
// @route   GET /add
// @access  Public
exports.addResource = asyncHandler(async (req, res, next) => {
    res.render("resources/add");
});

// @desc    Get single resource
// @route   GET /:id
// @access  Public
exports.getResource = asyncHandler(async (req, res, next) => {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
        return next(
            new ErrorResponse(
                `Resource not found with id of ${req.params.id}`,
                404
            )
        );
    }
    res.status(200).json({ success: true, data: resource });
});

// @desc    Create new resource
// @route   POST /add
// @access  Private
exports.createResource = asyncHandler(async (req, res, next) => {
    // Add user to request body
    //req.body.user = req.user.id;
    // Check for published resource
    //const publishedResource = await Resource.findOne({ user: req.user.id });
    // If the user is not an admin, they can only add one resource
    // if (publishedResource && req.user.role !== "admin") {
    //     return next(
    //         new ErrorResponse(
    //             `The user with ID ${req.user.id} has already published a resource`,
    //             400
    //         )
    //     );
    // }
    // const resource = await Resource.create(req.body);
    // res.status(201).json({
    //     success: true,
    //     data: resource
    // });
    // res.render("resources/add");
    let errors = [];

    if (!req.body.name) {
        errors.push({ text: "Please add a name for your resource" });
    }
    if (!req.body.description) {
        errors.push({ text: "Please add a description for your resource" });
    }
    if (!req.body.organizerName) {
        errors.push({ text: "Please add an organizer name" });
    }
    if (!req.body.organizerDesc) {
        errors.push({ text: "Please add a description for the organizer" });
    }

    if (errors.length > 0) {
        res.render("resources/add", {
            errors: errors,
            name: req.body.name,
            description: req.body.description,
            organizerName: req.body.organizerName,
            organizerDesc: req.body.organizerDesc
        });
    } else {
        const resource = await Resource.create(req.body);
        res.redirect("/resources");
    }
});

// @desc    Page to add new resource
// @route   GET /add
// @access  Public
exports.editResource = asyncHandler(async (req, res, next) => {
    let resource = await Resource.findById(req.params.id);

    res.render("resources/edit", { resource });
});

// @desc    Update resource
// @route   PUT /:id
// @access  Private
exports.updateResource = asyncHandler((req, res, next) => {
    Resource.findOne({
        _id: req.params.id
    }).then(resource => {
        resource.name = req.body.name;
        resource.description = req.body.description;
        resource.organizerName = req.body.organizerName;
        resource.organizerDesc = req.body.organizerDesc;

        resource.save().then(resource => {
            res.redirect("/resources");
        });
    });
    // let resource = await Resource.findById(req.params.id);

    // if (!resource) {
    //     return next(
    //         new ErrorResponse(
    //             `Resource not found with id of ${req.params.id}`,
    //             404
    //         )
    //     );
    // }

    // // Make sure user is resource owner
    // if (resource.user.toString() !== req.user.id && req.user.role !== "admin") {
    //     return next(
    //         new ErrorResponse(
    //             `User ${req.params.id} is not authorized to update this resource`,
    //             401
    //         )
    //     );
    // }

    // resource = await Resource.findOneAndUpdate(req.params.id, req.body, {
    //     new: true,
    //     runValidators: true
    // });

    // res.status(200).json({ success: true, data: resource });
});

// @desc    Delete resource
// @route   DELETE :id
// @access  Private
exports.deleteResource = asyncHandler(async (req, res, next) => {
    // Resource.remove({ _id: req.params.id }).then(() => {
    //     res.redirect("/resources");
    // });
    const resource = await Resource.findByIdAndDelete(req.params.id);

    // if (!resource) {
    //     return next(
    //         new ErrorResponse(
    //             `Resource not found with id of ${req.params.id}`,
    //             404
    //         )
    //     );
    // }

    // Make sure user is resource owner
    // if (resource.user.toString() !== req.user.id && req.user.role !== "admin") {
    //     return next(
    //         new ErrorResponse(
    //             `User ${req.params.id} is not authorized to delete this resource`,
    //             401
    //         )
    //     );
    // }

    resource.remove(() => res.redirect("/resources"));

    // res.status(200).json({ success: true, data: resource });
});
