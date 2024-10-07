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
    participants: {
        type: [String],
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);
