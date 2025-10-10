// controllers/dashboardController.js

const DoseLog = require('../models/DoseLog.js');
const mongoose = require('mongoose');

/**
 * @description This is the main logic for getting dashboard stats.
 * @route GET /api/dashboard/stats
 */
const getDashboardStats = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const logs = await DoseLog.find({
            user: userId,
            timestamp: { $gte: sevenDaysAgo }
        });

        const takenCount = logs.filter(log => log.status === 'taken').length;
        const missedCount = logs.filter(log => log.status === 'missed').length;
        
        const data = {
            labels: ['Taken', 'Missed'],
            datasets: [{
                label: 'Doses in Last 7 Days',
                data: [takenCount, missedCount],
                backgroundColor: ['#4ade80', '#f87171'],
            }]
        };

        res.status(200).json(data);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// CRITICAL: This line makes the function available to be imported in other files.
module.exports = {
    getDashboardStats
};

