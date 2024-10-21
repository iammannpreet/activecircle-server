const express = require('express');
const Activity = require('../../models/Activity');
const Event = require('../../models/Events');

const router = express.Router();

// Unified search for both activities and events
router.get('/search', async (req, res) => {
    const { query } = req.query;

    try {
        // Use regex for case-insensitive partial matching on multiple fields
        const regex = new RegExp(query, 'i');  // 'i' for case-insensitive

        const activities = await Activity.find({
            $or: [
                { type: { $regex: regex } },
                { location: { $regex: regex } },
                { description: { $regex: regex } },
                { title: { $regex: regex } }
            ]
        });

        const events = await Event.find({
            $or: [
                { type: { $regex: regex } },
                { location: { $regex: regex } },
                { description: { $regex: regex } },
                { title: { $regex: regex } }
            ]
        });

        // Combine results from both collections
        const results = [...activities, ...events];

        res.status(200).json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Error performing search' });
    }
});

module.exports = router;
