const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Import the path module

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Import the JWT middleware
const authenticateToken = require('./middleware/autheticationToken'); // Example path, update as needed

// Define a protected route in server.js (or another route file)
app.get('/api/v1/protected', authenticateToken, (req, res) => {
    res.json({ message: "You are authorized to view this content" });
});

// Enable CORS
app.use(cors());

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Import versioned Routes
const v1ActivityRoutes = require('./routes/v1/activities');
const v1UserRoutes = require('./routes/v1/users');
const v1EventRoutes = require('./routes/v1/events');
const v1SearchRoutes = require('./routes/v1/search');
const v1AuthRoutes = require('./routes/v1/auth'); // <-- Import auth routes

// Use versioned routes
app.use('/api/v1/activities', v1ActivityRoutes);
app.use('/api/v1/users', v1UserRoutes);
app.use('/api/v1/events', v1EventRoutes);
app.use('/api/v1', v1SearchRoutes);
app.use('/api/v1/auth', v1AuthRoutes); // <-- Add auth route

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
