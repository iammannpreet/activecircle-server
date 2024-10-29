// Import necessary dependencies
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getAllActivities, createActivity, deleteActivityById } = require('../../services/activityService');
const authenticateToken = require('../../middleware/autheticateToken');
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

// GET /api/activities - Fetch all activities
router.get('/', async (req, res, next) => {
    try {
        // Fetch all activities using the service function
        const activities = await getAllActivities();
        res.status(200).json(activities);
    } catch (err) {
        console.error("Error fetching activities:", err);
        next(err); // Passes the error to the centralized error handler
    }
});

// POST /api/activities - Create a new activity
router.post('/', authenticateToken, upload.single('image'), async (req, res, next) => {
    try {
        const { type, location, details, latitude, longitude, date } = req.body;

        const imagePath = req.file ? `/uploads/activities/${req.file.filename}` : '';

        // Construct the new activity data
        const activityData = {
            type,
            location,
            details,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            date: new Date(date),
            image: imagePath,
            user: req.user.id, // Reference the authenticated user's ID
        };

        // Create the new activity using the service function
        const savedActivity = await createActivity(activityData);
        res.status(201).json(savedActivity);
    } catch (err) {
        console.error("Error creating activity:", err);
        next(err); // Passes the error to the centralized error handler
    }
});
// DELETE /api/v1/activities/:id - Delete an activity by ID
router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const activityId = req.params.id;

        // Attempt to find the activity by its ID
        const activity = await Activity.findById(activityId);
        console.log('Fetched activity:', activity);

        // Check if the activity exists
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Check if the logged-in user is the owner of the activity
        if (activity.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this activity' });
        }

        // Use deleteOne method to remove the activity
        await Activity.deleteOne({ _id: activityId });
        res.json({ message: 'Activity deleted successfully' });
    } catch (err) {
        console.error("Error deleting activity:", err);
        next(err); // Pass the error to the centralized error handler
    }
});


module.exports = router;
