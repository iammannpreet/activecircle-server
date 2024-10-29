const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getAllEvents, createEvent, deleteEventById } = require('../../services/eventService');
const authenticateToken = require('../../middleware/autheticateToken');
const Event = require('../../models/Events'); // Import the Event model

// Set up storage using Multer
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/events'));
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// GET /api/events - Get all events
router.get('/', async (_req, res, next) => {
    try {
        const events = await getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        next(error);
    }
});

// POST /api/events - Create a new event
router.post('/', authenticateToken, upload.single('image'), async (req, res, next) => {
    try {
        const { type, location, details, latitude, longitude, date } = req.body;

        // Validate the required fields
        if (!type || !location || !details || !latitude || !longitude || !date) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Parse and validate latitude, longitude, and date
        const parsedLatitude = parseFloat(latitude);
        const parsedLongitude = parseFloat(longitude);
        const parsedDate = new Date(date);

        if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
            return res.status(400).json({ error: 'Invalid latitude or longitude.' });
        }

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format.' });
        }

        const imagePath = req.file ? `/uploads/events/${req.file.filename}` : '';

        // Construct the new event data
        const eventData = {
            type,
            location,
            details,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            date: parsedDate,
            image: imagePath,
            user: req.user.id, // Reference the authenticated user's ID
            organizer: req.user.name
        };

        // Create the new event using the service function
        const savedEvent = await createEvent(eventData);
        res.status(201).json(savedEvent);
    } catch (err) {
        console.error('Error creating event:', err);
        next(err);
    }
});

// DELETE /api/events/:id - Delete an event by ID
router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const eventId = req.params.id;

        // Attempt to find the event by its ID
        const event = await Event.findById(eventId);
        console.log('Fetched event:', event);

        // Check if the event exists
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the logged-in user is the owner of the event
        if (event.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this event' });
        }

        // Remove the event if checks pass
        await Event.deleteOne({ _id: eventId });
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error('Error deleting event:', err);
        next(err);
    }
});

module.exports = router;
