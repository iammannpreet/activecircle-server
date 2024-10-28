require('dotenv').config();
const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const Event = require('../models/Events');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

Activity.collection.createIndex({
    location: 'text',
    description: 'text',
    type: 'text',
    title: 'text'
}).then(() => {
    console.log('Text index created for Activity model');
}).catch(err => console.error(err));

Event.collection.createIndex({
    location: 'text',
    description: 'text',
    type: 'text',
    title: 'text'
}).then(() => {
    console.log('Text index created for Event model');
    mongoose.connection.close();
}).catch(err => console.error(err));
