const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Resource = require("../models/Resource");

// @desc    Get all resources
// @route   GET /api/v1/resources
// @access  Public
exports.getResources = asyncHandler(async (req, res, next) => {
    const resources = await Resource.find();

    res.status(200).json({
        success: true,
        count: resources.length,
        data: resources
    });
});

// @desc    Get single resource
// @route   GET /api/v1/resources/:id
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

// @desc    Create new bootcamp
// @route   POST /api/v1/resources
// @access  Private
exports.createResource = asyncHandler(async (req, res, next) => {
    // Add user to request body
    req.body.user = req.user.id;

    // Check for published resource
    const publishedResource = await Resource.findOne({ user: req.user.id });

    // If the user is not an admin, they can only add one resource
    if (publishedResource && req.user.role !== "admin") {
        return next(
            new ErrorResponse(
                `The user with ID ${req.user.id} has already published a resource`,
                400
            )
        );
    }

    const resource = await Resource.create(req.body);

    res.status(201).json({
        success: true,
        data: resource
    });
});

// @desc    Update resource
// @route   PUT /api/v1/resources/:id
// @access  Private
exports.updateResource = asyncHandler(async (req, res, next) => {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
        return next(
            new ErrorResponse(
                `Resource not found with id of ${req.params.id}`,
                404
            )
        );
    }

    // Make sure user is resource owner
    if (resource.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to update this resource`,
                401
            )
        );
    }

    resource = await Resource.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: resource });
});

// @desc    Delete resource
// @route   DELETE /api/v1/resources/:id
// @access  Private
exports.deleteResource = asyncHandler(async (req, res, next) => {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
        return next(
            new ErrorResponse(
                `Resource not found with id of ${req.params.id}`,
                404
            )
        );
    }

    // Make sure user is resource owner
    if (resource.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to delete this resource`,
                401
            )
        );
    }

    resource.remove();

    res.status(200).json({ success: true, data: resource });
});
