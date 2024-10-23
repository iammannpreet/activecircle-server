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
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    participants: {
        type: [String],
        default: []
    },
    date: {
        type: Date,
        required: true
    },
    image: {
        type: String
    }
});

ActivitySchema.index({ type: 'text', location: 'text', details: 'text', organizer: 'text' });

module.exports = mongoose.model('Activity', ActivitySchema);
