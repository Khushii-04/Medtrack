import Log from '../models/DoseLog.js';
import Medication from '../models/Medication.js';
import mongoose from 'mongoose';

export const getAdherenceStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Get all logs from the last 7 days for the user
        const logs = await Log.find({
            user: userId,
            timestamp: { $gte: sevenDaysAgo }
        });

        const takenCount = logs.filter(log => log.status === 'taken').length;
        const missedCount = logs.filter(log => log.status === 'missed').length;

        // More complex logic could be added here to calculate "expected" doses
        // For now, we return a simple count of taken vs. missed.
        
        // Data formatted for a library like Chart.js
        const data = {
            labels: ['Taken', 'Missed'],
            datasets: [{
                label: 'Doses in Last 7 Days',
                data: [takenCount, missedCount],
                backgroundColor: ['#4ade80', '#f87171'], // Green for taken, Red for missed
            }]
        };

        res.json(data);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
