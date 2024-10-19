const express = require('express');
const router = express.Router();
const { getAllEvents, createEvent, deleteEventById } = require('../../services/eventService');  // Import the service

// GET /api/v1/events - Fetch all events
router.get('/', async (req, res, next) => {
    try {
        const events = await getAllEvents();  // Call the service
        res.status(200).json(events);
    } catch (err) {
        next(err);  // Pass the error to the centralized error handler
    }
});

// POST /api/v1/events - Create a new event
router.post('/', async (req, res, next) => {
    try {
        const savedEvent = await createEvent(req.body);  // Use the service to create an event
        res.status(201).json(savedEvent);
    } catch (err) {
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
        next(err);
    }
});

module.exports = router;
