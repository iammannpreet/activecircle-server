const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getAllEvents, createEvent, deleteEventById } = require('../../services/eventService');

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/events'));
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        const { type, location, details, organizer, latitude, longitude, date } = req.body;

        if (!type || !location || !details || !organizer || !latitude || !longitude || !date) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

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

        const savedEvent = await createEvent(eventData);
        res.status(201).json(savedEvent);
    } catch (err) {
        console.error('Error creating event:', err);
        next(err);
    }
});

router.get('/', async (_req, res, next) => {
    try {
        const events = await getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        next(error);
    }
});

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
