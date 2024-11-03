const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const authenticateToken = require('./middleware/autheticateToken');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Set security HTTP headers with Helmet
app.use(helmet());

// Enable CORS with frontend origin
app.use(cors({
    origin: ['http://localhost:3000', 'https://deluxe-banoffee-13d115.netlify.app'], // Replace <your-netlify-site> with your actual Netlify domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the "public" directory with explicit CORS headers
app.use('/public', express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

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
        process.exit(1);
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
        process.exit(0);
    });
};

// Handle termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
