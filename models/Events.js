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
    organizer: {
        type: String,
        required: true
    }
});

const Events = mongoose.model('Events', eventSchema);
module.exports = Events;
