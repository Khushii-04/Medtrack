const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const moment = require('moment-timezone');
const connectDB = require("./config/db");
const startNotificationScheduler = require('./services/notificationService');
const authRoutes = require('./routes/authRouter.js');
const medicationRoutes = require('./routes/medicationRoutes.js'); // <-- NEW

const doseRoutes = require('./routes/doseRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes');

dotenv.config();
moment.tz.setDefault("Asia/Kolkata");
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/medications', medicationRoutes); // <-- NEW: Tells Express to use these routes for this path
app.use('/api/doses', doseRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    
    // Start the notification scheduler when the server is live
    startNotificationScheduler();
});
