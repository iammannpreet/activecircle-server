// services/eventService.js
const Event = require('../models/Events'); // Ensure the path and name are correct

// Get all events
const getAllEvents = async () => {
    return await Event.find(); // Same structure as getAllActivities
};

// Create a new event
const createEvent = async (eventData) => {
    const event = new Event(eventData);
    return await event.save(); // Same structure as createActivity
};

// Delete an event by ID
const deleteEventById = async (id) => {
    return await Event.findByIdAndDelete(id); // Same structure as deleteActivityById
};

module.exports = {
    getAllEvents,
    createEvent,
    deleteEventById
};
