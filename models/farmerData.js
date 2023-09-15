const mongoose = require("mongoose");

const farmerDataSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FarmerModel'
    },
    landsize: {
        type: Number,
        required: true
    },
    estimated_production: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true,
        lowercase: true
    }
}, { timestamps: true });

const FarmerDataModel = mongoose.model('FarmerDataModel', farmerDataSchema);
module.exports = FarmerDataModel;