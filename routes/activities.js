const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// POST /api/activities - Create new activity
router.post('/', async (req, res) => {
    const { type, location, details, organizer } = req.body;

    const newActivity = new Activity({
        type,
        location,
        details,
        organizer
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

module.exports = router;
