const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));

const v1ActivityRoutes = require('./routes/v1/activities');
const v1UserRoutes = require('./routes/v1/users');
const v1EventRoutes = require('./routes/v1/events');
const v1SearchRoutes = require('./routes/v1/search');

app.use('/api/v1/activities', v1ActivityRoutes);
app.use('/api/v1/users', v1UserRoutes);
app.use('/api/v1/events', v1EventRoutes);
app.use('/api/v1', v1SearchRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
