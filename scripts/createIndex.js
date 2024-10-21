require('dotenv').config();  // Load environment variables from .env
const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const Event = require('../models/Events');

// Connect to your MongoDB database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Create text index for Activities
Activity.collection.createIndex({
    location: 'text',
    description: 'text',
    type: 'text',
    title: 'text'
}).then(() => {
    console.log('Text index created for Activity model');
}).catch(err => console.error(err));

// Create text index for Events
Event.collection.createIndex({
    location: 'text',
    description: 'text',
    type: 'text',
    title: 'text'
}).then(() => {
    console.log('Text index created for Event model');
    mongoose.connection.close(); // Close the connection after index creation
}).catch(err => console.error(err));
