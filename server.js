// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet'); // Add helmet for security
const authenticateToken = require('./middleware/autheticateToken');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security HTTP headers with Helmet
app.use(helmet());

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Import versioned Routes
const v1ActivityRoutes = require('./routes/v1/activities');
const v1UserRoutes = require('./routes/v1/users');
const v1EventRoutes = require('./routes/v1/events');
const v1SearchRoutes = require('./routes/v1/search');
const v1AuthRoutes = require('./routes/v1/auth');

// Use versioned routes
app.use('/api/v1/activities', v1ActivityRoutes);
app.use('/api/v1/users', v1UserRoutes);
app.use('/api/v1/events', v1EventRoutes);
app.use('/api/v1', v1SearchRoutes);
app.use('/api/v1/auth', v1AuthRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure code if connection fails
    });

// Test protected route
app.get('/api/v1/protected', authenticateToken, (req, res) => {
    res.json({ message: "You are authorized to view this content" });
});

// Attach error handler middleware at the end after all routes
app.use(errorHandler);

// Graceful shutdown to close MongoDB connection
const shutdown = () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0); // Exit process with success code
    });
};

// Handle termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
