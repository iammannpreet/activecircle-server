const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getAllEvents, createEvent, deleteEventById } = require('../../services/eventService');

// Set up storage using Multer if file uploads are needed in the future
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/events'));
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name with timestamp
    }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        // Destructure the required fields from the request body
        const { type, location, details, organizer, latitude, longitude, date } = req.body;

        // Ensure that all required fields are present
        if (!type || !location || !details || !organizer || !latitude || !longitude || !date) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Parse latitude, longitude, and date to ensure they are in the correct format
        const parsedLatitude = parseFloat(latitude);
        const parsedLongitude = parseFloat(longitude);
        const parsedDate = new Date(date);

        // Check for NaN and Invalid Date values
        if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
            return res.status(400).json({ error: 'Invalid latitude or longitude.' });
        }

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format.' });
        }

        // Get the image path if a file was uploaded
        const imagePath = req.file ? `/uploads/events/${req.file.filename}` : '';

        // Create the event data object
        const eventData = {
            type,
            location,
            details,
            organizer,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            date: parsedDate,
            image: imagePath
        };

        // Create the new event using a service function
        const savedEvent = await createEvent(eventData);
        res.status(201).json(savedEvent);
    } catch (err) {
        console.error('Error creating event:', err);
        next(err); // Passes the error to the centralized error handler
    }
});

// GET /api/v1/events - Fetch all events
router.get('/', async (_req, res, next) => {
    try {
        const events = await getAllEvents(); // Using the service function
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        next(error); // Passes the error to the centralized error handler
    }
});

// DELETE /api/v1/events/:id - Delete an event by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedEvent = await deleteEventById(req.params.id);
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
