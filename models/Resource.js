const mongoose = require("mongoose");

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
        type: String
        //required: [true, "Please add an address"]
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

module.exports = mongoose.model("Resource", ResourceSchema);
