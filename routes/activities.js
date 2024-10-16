const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

router.post('/', async (req, res) => {
    const { type, location, details, organizer, participants } = req.body;

    const newActivity = new Activity({
        type,
        location,
        details,
        organizer,
        participants: participants || []  // Make sure participants are passed, or use an empty array as default
    });

    try {
        const savedActivity = await newActivity.save();
        res.json(savedActivity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET /api/activities - Get all activities
router.get('/', async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE activity by ID
router.delete('/:id', async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.json({ message: 'Activity deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
