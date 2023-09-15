const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '1h' }, // Set the TTL index to automatically delete documents after 1 hour
    }
}, { timestamps: true })

const OtpModel = mongoose.model('OtpModel', otpSchema);
module.exports = OtpModel;