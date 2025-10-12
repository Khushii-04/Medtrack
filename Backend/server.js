const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
// const express = require('express');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRouter');
const medicationRoutes = require('./Routes/medicationRoutes');
const userRoutes = require('./routes/userRoutes');
const doseRoutes = require('./routes/doseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const startNotificationScheduler = require('./services/notificationService');
const moment = require('moment-timezone');

// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:8080/medtrack', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doses', doseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'MEDTrack API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    startNotificationScheduler();
});
