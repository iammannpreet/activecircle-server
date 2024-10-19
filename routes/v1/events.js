const express = require('express');
const router = express.Router();
const Event = require('../../models/Events'); // Import your event model
const { getAllEvents, createEvent, deleteEventById } = require('../../services/eventService');  // Import the service

// GET /api/v1/events - Fetch all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({});
        console.log('Events:', events);  // Log the event data

        res.status(200).json(events);  // Directly return the events
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Error fetching events' });
    }
});

// POST /api/v1/events - Create a new event
router.post('/', async (req, res, next) => {
    try {
        const { type, location, latitude, longitude, organizer } = req.body;

        // Validate event data before saving
        if (!type || !location || !latitude || !longitude || !organizer) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newEvent = new Event({
            type,
            location,
            latitude,
            longitude,
            organizer
        });

        const savedEvent = await newEvent.save();  // Save the event to MongoDB
        res.status(201).json(savedEvent);
    } catch (err) {
        console.error('Error creating event:', err);
        next(err);
    }
});

// DELETE /api/v1/events/:id - Delete an event by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedEvent = await deleteEventById(req.params.id);  // Use the service to delete
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted' });
    } catch (err) {
        console.error('Error deleting event:', err);
        next(err);
    }
});

module.exports = router;
