const express = require('express');
const Activity = require('../../models/Activity');
const Event = require('../../models/Events');
const router = express.Router();

router.get('/search', async (req, res) => {
    const { query } = req.query;

    try {
        const regex = new RegExp(query, 'i');

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

        const results = [...activities, ...events];

        res.status(200).json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Error performing search' });
    }
});

module.exports = router;
