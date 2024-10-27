const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    preferences: {
        type: [String],
        default: []
    },
    joinedActivities: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Activity',
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); // Ensure this line is present and correct
