// controllers/doseController.js

const DoseLog = require('../models/DoseLog');
const mongoose = require('mongoose');

/**
 * @description Log a dose as taken or missed
 * @route POST /api/doses/log
 * @access Private
 */
const logDose = async (req, res) => {
    try {
        const { medicationId, status, scheduledTime } = req.body;
        const newLog = new DoseLog({
            medication: medicationId,
            user: req.user.id,
            status,
            scheduledTime
        });
        await newLog.save();
        res.status(201).json({ message: 'Dose logged successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @description Get adherence statistics for the dashboard
 * @route GET /api/doses/stats
 * @access Private
 */
const getDoseStats = async (req, res) => {
    try {
        const adherenceStats = await DoseLog.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $group: {
                    _id: '$status', // Group by 'taken' or 'missed'
                    count: { $sum: 1 }
                }
            }
        ]);

        const stats = { taken: 0, missed: 0, adherenceRate: 0 };
        adherenceStats.forEach(stat => {
            if (stat._id === 'taken') stats.taken = stat.count;
            if (stat._id === 'missed') stats.missed = stat.count;
        });

        const totalDoses = stats.taken + stats.missed;
        if (totalDoses > 0) {
            stats.adherenceRate = Math.round((stats.taken / totalDoses) * 100);
        }

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    logDose,
    getDoseStats
};