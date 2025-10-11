// controllers/doseController.js
const DoseLog = require('../models/DoseLog');
const Medication = require('../models/Medication');
const MedicineHistory = require('../models/MedicineHistory');
const mongoose = require('mongoose');

/**
 * @description Log a dose as taken or missed with day tracking
 * @route POST /api/doses/log
 * @access Private
 */
const logDose = async (req, res) => {
    try {
        const { medicationId, status, scheduledTime, day } = req.body;
        
        // Get medication details
        const medication = await Medication.findById(medicationId);
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        // Create dose log
        const newLog = new DoseLog({
            medication: medicationId,
            user: req.user.id,
            status,
            scheduledTime: scheduledTime || new Date()
        });
        await newLog.save();

        // Update daily status in medication
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentDay = day || ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];

        const existingStatusIndex = medication.dailyStatus.findIndex(
            ds => ds.date.toDateString() === today.toDateString()
        );

        if (existingStatusIndex >= 0) {
            medication.dailyStatus[existingStatusIndex].status = status;
            medication.dailyStatus[existingStatusIndex].takenAt = status === 'taken' ? new Date() : null;
        } else {
            medication.dailyStatus.push({
                date: today,
                day: currentDay,
                status,
                takenAt: status === 'taken' ? new Date() : null
            });
        }

        await medication.save();

        // Create history entry
        const historyEntry = new MedicineHistory({
            user: req.user.id,
            medicationId: medication._id,
            medicineName: medication.name,
            dosage: medication.dosage,
            status
        });
        await historyEntry.save();

        res.status(201).json({ 
            message: 'Dose logged successfully',
            log: newLog
        });
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
        // Get stats from DoseLog
        const adherenceStats = await DoseLog.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $group: {
                    _id: '$status',
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

/**
 * @description Get dose history with day-wise breakdown
 * @route GET /api/doses/history
 * @access Private
 */
const getDoseHistory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let query = { user: req.user.id };
        
        if (startDate && endDate) {
            query.loggedAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const history = await DoseLog.find(query)
            .populate('medication', 'name dosage')
            .sort({ loggedAt: -1 })
            .limit(100);

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @description Get weekly adherence for heatmap
 * @route GET /api/doses/weekly
 * @access Private
 */
const getWeeklyAdherence = async (req, res) => {
    try {
        const medications = await Medication.find({ user: req.user.id });
        
        const weeklyData = [];
        const today = new Date();
        
        // Get last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
            
            let takenCount = 0;
            let missedCount = 0;
            
            medications.forEach(med => {
                const dayStatus = med.dailyStatus.find(
                    ds => ds.date.toDateString() === date.toDateString()
                );
                
                if (dayStatus) {
                    if (dayStatus.status === 'taken') takenCount++;
                    if (dayStatus.status === 'missed') missedCount++;
                }
            });
            
            weeklyData.push({
                date: date.toISOString().split('T')[0],
                day: dayName,
                taken: takenCount,
                missed: missedCount
            });
        }
        
        res.json(weeklyData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    logDose,
    getDoseStats,
    getDoseHistory,
    getWeeklyAdherence
};