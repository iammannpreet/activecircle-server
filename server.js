const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const eventRoutes = require('./routes/v1/events');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Import versioned Routes
const v1ActivityRoutes = require('./routes/v1/activities');
const v1UserRoutes = require('./routes/v1/users');
const v1EventRoutes = require('./routes/v1/events');

// Use versioned routes
app.use('/api/v1/activities', v1ActivityRoutes);
app.use('/api/v1/users', v1UserRoutes);
app.use('/api/v1/events', v1EventRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
