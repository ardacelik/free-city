const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");

const ResourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please add a description"]
    },
    organizerName: {
        type: String
    },
    organizerDesc: {
        type: String
    },
    address: {
        type: String,
        required: [true, "Please add an address"]
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ["Point"]
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,
        required: true
    }
});

// Geocode & create location field
ResourceSchema.pre("save", async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: "Point",
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    };

    // Do not save address in DB
    this.address = undefined;
    next();
});

module.exports = mongoose.model("Resource", ResourceSchema);
