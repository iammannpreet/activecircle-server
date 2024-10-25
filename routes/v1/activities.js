const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getAllActivities, createActivity, deleteActivityById } = require('../../services/activityService');

// Set up storage using Multer
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/activities'));
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name with timestamp
    }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        const { type, location, details, organizer, latitude, longitude, date } = req.body;

        const imagePath = req.file ? `/uploads/activities/${req.file.filename}` : '';

        const activityData = {
            type,
            location,
            details,
            organizer,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            date: new Date(date),
            image: imagePath
        };

        // Create the new activity using a service function
        const savedActivity = await createActivity(activityData);  // Corrected this line
        res.status(201).json(savedActivity);
    } catch (err) {
        console.error("Error creating activity:", err);
        next(err); // Passes the error to the centralized error handler
    }
});

// GET /api/activities - Get all activities
router.get('/', async (_req, res, next) => {
    try {
        const activities = await getAllActivities(); // Using the service function
        res.json(activities);
    } catch (err) {
        next(err); // Passes the error to the centralized error handler
    }
});

// DELETE /api/activities/:id - Delete an activity by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const activity = await deleteActivityById(req.params.id); // Using the service function
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.json({ message: 'Activity deleted' });
    } catch (err) {
        next(err); // Passes the error to the centralized error handler
    }
});

module.exports = router;
