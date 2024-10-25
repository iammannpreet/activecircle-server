const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true  // Ensure that the email is unique in the database
    },
    password: {
        type: String,
        required: true
    },
    preferences: {
        type: [String],  // Store an array of activity preferences (e.g., ["Gym", "Yoga"])
        default: []
    },
    joinedActivities: {
        type: [mongoose.Schema.Types.ObjectId],  // Reference to activity IDs the user has joined
        ref: 'Activity',  // This refers to the Activity model
        default: []
    }
}, { timestamps: true });  // Automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('User', UserSchema);
