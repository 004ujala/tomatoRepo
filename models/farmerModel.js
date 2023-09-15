const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    aadhar: {
        type: String,
        unique: true
    },
    contact: {
        type: String
    },
    address: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const FarmerModel = mongoose.model('FarmerModel', farmerSchema);
module.exports = FarmerModel;