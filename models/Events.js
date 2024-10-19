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
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    organizer: {
        type: String,
        required: true
    }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
