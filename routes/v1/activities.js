const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getAllActivities, createActivity, deleteActivityById } = require('../../services/activityService');

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/activities'));
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
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

        const savedActivity = await createActivity(activityData);
        res.status(201).json(savedActivity);
    } catch (err) {
        console.error("Error creating activity:", err);
        next(err);
    }
});

router.get('/', async (_req, res, next) => {
    try {
        const activities = await getAllActivities();
        res.json(activities);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const activity = await deleteActivityById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.json({ message: 'Activity deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
