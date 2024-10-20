const express = require('express');
const router = express.Router();
const { getAllActivities, createActivity, deleteActivityById } = require('../../services/activityService');

// POST /api/activities - Create a new activity
router.post('/', async (req, res, next) => {
    try {
        const savedActivity = await createActivity(req.body);  // Using the service function
        res.json(savedActivity);
    } catch (err) {
        next(err);  // Passes the error to the centralized error handler
    }
});

// GET /api/activities - Get all activities
router.get('/', async (req, res, next) => {
    try {
        const activities = await getAllActivities();  // Using the service function
        res.json(activities);
    } catch (err) {
        next(err);  // Passes the error to the centralized error handler
    }
});

// DELETE /api/activities/:id - Delete an activity by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const activity = await deleteActivityById(req.params.id);  // Using the service function
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.json({ message: 'Activity deleted' });
    } catch (err) {
        next(err);  // Passes the error to the centralized error handler
    }
});

module.exports = router;
