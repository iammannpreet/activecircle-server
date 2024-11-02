// services/activityService.js
const Activity = require('../models/Activity');

// Get all activities
const getAllActivities = async () => {
    return await Activity.find().populate('user', 'name');
};


// Create a new activity
const createActivity = async (activityData) => {
    const activity = new Activity(activityData);
    return await activity.save();
};

// Delete an activity by ID
const deleteActivityById = async (id) => {
    return await Activity.findByIdAndDelete(id);
};

module.exports = {
    getAllActivities,
    createActivity,
    deleteActivityById
};
