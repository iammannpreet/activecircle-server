const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getAllActivities, createActivity, deleteActivityById } = require('../../services/activityService');
const authenticateToken = require('../../middleware/autheticateToken');
const Activity = require('../../models/Activity');

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/activities'));
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.get('/', async (req, res, next) => {
    try {
        const activities = await getAllActivities();
        res.status(200).json(activities);
    } catch (err) {
        console.error("Error fetching activities:", err);
        next(err);
    }
});

router.post('/', authenticateToken, upload.single('image'), async (req, res, next) => {
    try {
        const { type, location, details, latitude, longitude, date } = req.body;

        const imagePath = req.file ? `/uploads/activities/${req.file.filename}` : '';

        const activityData = {
            type,
            location,
            details,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            date: new Date(date),
            image: imagePath,
            user: req.user.id,
        };

        const savedActivity = await createActivity(activityData);
        res.status(201).json(savedActivity);
    } catch (err) {
        console.error("Error creating activity:", err);
        next(err);
    }
});
router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const activityId = req.params.id;

        const activity = await Activity.findById(activityId);
        console.log('Fetched activity:', activity);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        if (activity.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this activity' });
        }

        await Activity.deleteOne({ _id: activityId });
        res.json({ message: 'Activity deleted successfully' });
    } catch (err) {
        console.error("Error deleting activity:", err);
        next(err);
    }
});

module.exports = router;
