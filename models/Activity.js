const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    latitude: {
        type: Number, // Store latitude as a number
        required: true
    },
    longitude: {
        type: Number, // Store longitude as a number
        required: true
    },
    participants: {
        type: [String],
        default: []
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);
