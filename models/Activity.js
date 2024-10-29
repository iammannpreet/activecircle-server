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
        type: String,
        default: '' // Optional: Default empty string if no image is provided
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Create an index for text search
ActivitySchema.index({ type: 'text', location: 'text', details: 'text' });

// Check if the model is already compiled, otherwise create and export it
module.exports = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
