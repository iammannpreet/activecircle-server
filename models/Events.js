// models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    type: { // Renamed to 'type' for consistency with 'Activity'
        type: String,
        required: true
    },
    name: { // Optional: Keeping name for differentiation if needed
        type: String,
    },
    description: { // Aligned with 'details' in Activity
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
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    participants: {
        type: [mongoose.Schema.Types.ObjectId], // Array of User references
        ref: 'User',
        default: []
    },
    image: {
        type: String,
        default: ''
    }
});

// Add a text index to the schema for full-text search on specific fields
EventSchema.index({ type: 'text', location: 'text', description: 'text', name: 'text' });

module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);
