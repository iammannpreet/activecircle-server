const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
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
    organizer: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true
    },
    participants: {
        type: [mongoose.Schema.Types.ObjectId], // Reference to User model
        ref: 'User',
        default: []
    },
    image: {
        type: String
    }
});

EventSchema.index({ name: 'text', description: 'text', location: 'text' });

module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);
