const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getAllActivities, createActivity, deleteActivityById } = require('../../services/activityService');
const authenticateToken = require('../../middleware/autheticationToken');
const Activity = require('../../models/Activity');

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

// POST /api/activities - Create a new activity
router.post('/', authenticateToken, upload.single('image'), async (req, res, next) => {
    try {
        const { type, location, details, latitude, longitude, date } = req.body;

        const imagePath = req.file ? `/uploads/activities/${req.file.filename}` : '';

        const activityData = {
            type,
            location,
            details,
            organizer: req.user.name, // Assuming the user's name is stored in the JWT
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            date: new Date(date),
            image: imagePath,
            user: req.user.id // Associate the logged-in user's ID with the activity
        };

        // Create the new activity using a service function
        const savedActivity = await createActivity(activityData);
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
router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const activity = await Activity.findById(req.params.id);

        // Check if the activity exists
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Check if the logged-in user is the owner of the activity
        if (activity.user.toString() !== req.user.id) { // Assuming 'user' field stores the creator's ID
            return res.status(403).json({ message: 'You are not authorized to delete this activity' });
        }

        await activity.remove(); // Remove the activity if checks pass
        res.json({ message: 'Activity deleted' });
    } catch (err) {
        next(err); // Passes the error to the centralized error handler
    }
});

module.exports = router;
