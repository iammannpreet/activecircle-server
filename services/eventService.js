const Event = require('../models/Events');

// Get all events
const getAllEvents = async () => {
    return await Event.find();
};

// Create an event
const createEvent = async (eventData) => {
    const event = new Event(eventData);
    return await event.save();
};

// Delete an event by ID
const deleteEventById = async (id) => {
    return await Event.findByIdAndDelete(id);
};

module.exports = {
    getAllEvents,
    createEvent,
    deleteEventById
};
