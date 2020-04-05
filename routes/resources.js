const express = require("express");
const Resource = require("../models/Resource");
const { ensureAuthenticated } = require("../helpers/auth");
const kmeans = require("node-kmeans");

const router = express.Router();

// @desc    Get all resources
// @route   GET /
// @access  Public
router.get("/", (req, res) => {
    let vectors = new Array();

    Resource.find({})
        .sort({ createdAt: "desc" })
        .then(resources => {
            for (let i = 0; i < resources.length; i++) {
                vectors[i] = [
                    resources[i].location.coordinates[0],
                    resources[i].location.coordinates[1]
                ];
            }
            kmeans.clusterize(vectors, { k: 3 }, (err, res) => {
                ///  {k: 3} you can change the number into anything amount of clusters
                if (err) console.error(err);
                else
                    for (let j = 0; j < res.length; j++) {
                        console.log(res[j]["clusterInd"]); /// this will return the datasets in each cluster in the form of a number representing the array data
                    }
            });
            console.log(resources);
            //console.log(vectors);
            res.render("resources/index", {
                resources,
                vectors
            });
        });
});

// @desc    Page to add new resource
// @route   GET /add
// @access  Public
router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("resources/add");
});

// @desc    Create new resource
// @route   POST /add
// @access  Private
router.post("/add", (req, res) => {
    let errors = [];

    if (!req.body.name) {
        errors.push({ text: "Please add a name for your resource" });
    }
    if (!req.body.description) {
        errors.push({ text: "Please add a description for your resource" });
    }
    if (!req.body.address) {
        errors.push({ text: "Please add an address for the resource" });
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
            address: req.body.address,
            organizerName: req.body.organizerName,
            organizerDesc: req.body.organizerDesc
        });
    } else {
        const newUser = {
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            organizerName: req.body.organizerName,
            organizerDesc: req.body.organizerDesc,
            user: req.user.id
        };
        new Resource(newUser).save().then(resource => {
            req.flash("success_msg", "Resource added");
            res.redirect("/resources");
            console.log(req.body);
        });
    }
});

// @desc    Update an already created resource
// @route   GET /edit/:id
// @access  Public
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    Resource.findOne({
        _id: req.params.id
    }).then(resource => {
        if (resource.user != req.user.id) {
            req.flash("error_msg", "Not Authorized");
            res.redirect("/resources");
        } else {
            res.render("resources/edit", { resource });
        }
    });
});

// @desc    Update resource
// @route   PUT /:id
// @access  Private
router.put("/:id", ensureAuthenticated, (req, res) => {
    Resource.findOne({
        _id: req.params.id
    }).then(resource => {
        resource.name = req.body.name;
        resource.description = req.body.description;
        resource.address = req.body.address;
        resource.organizerName = req.body.organizerName;
        resource.organizerDesc = req.body.organizerDesc;

        resource.save().then(resource => {
            req.flash("success_msg", "Resource updated");
            res.redirect("/resources");
        });
    });
});

// @desc    Delete resource
// @route   DELETE :id
// @access  Private
router.delete("/:id", ensureAuthenticated, (req, res) => {
    Resource.findOne({
        _id: req.params.id
    }).then(resource => {
        if (resource.user != req.user.id) {
            req.flash("error_msg", "Not Authorized");
            res.redirect("/resources");
        } else {
            Resource.remove({ _id: req.params.id }).then(() => {
                req.flash("success_msg", "Resource removed");
                res.redirect("/resources");
            });
        }
    });
});

// const data = [
//     {'company': 'test' , 'lat': 43.9406384, 'lng': -38.8871807},

// ];

// let vectors = new Array();
// for (let i = 0 ; i < data.length ; i++) {
//     vectors[i] = [ data[i]['lat'] , data[i]['lng']];    // Create the data 2D-array (vectors) describing the data, lat being the latitude given from above and lng being the longitude given from above
// }

// const kmeans = require('node-kmeans');
// kmeans.clusterize(vectors, {k: 3}, (err,res) => {   ///  {k: 3} you can change the number into anything amount of clusters
//     if (err) console.error(err);
//     else
//     for (let j = 0 ; j < res.length ; j++) {

//         console.log(res[j]['clusterInd']);    /// this will return the datasets in each cluster in the form of a number representing the array data
//     }
// });

module.exports = router;
