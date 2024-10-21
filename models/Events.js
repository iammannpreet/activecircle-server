const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    type: {
        type: String,
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
    details: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

eventSchema.index({ type: 'text', location: 'text', details: 'text', organizer: 'text' });

const Events = mongoose.model('Events', eventSchema);
module.exports = Events;
