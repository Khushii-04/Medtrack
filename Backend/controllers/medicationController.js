const Medication = require('../models/Medication');
const MedicineHistory = require('../models/MedicineHistory');

const createMedication = async (req, res) => {
    try {
        const { name, dosage, frequency, duration, time } = req.body;
        const newMedication = new Medication({
            user: req.user.id,
            name,
            dosage,
            frequency,
            duration,
            time,
            dailyStatus: []
        });
        const savedMedication = await newMedication.save();
        res.status(201).json(savedMedication);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllMedications = async (req, res) => {
    try {
        const medications = await Medication.find({ user: req.user.id });
        res.json(medications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateMedication = async (req, res) => {
    try {
        const updatedMedication = await Medication.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedMedication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        res.json(updatedMedication);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteMedication = async (req, res) => {
    try {
        const deletedMedication = await Medication.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user.id 
        });
        if (!deletedMedication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        res.json({ message: 'Medication deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const recordMedicineTaken = async (req, res) => {
    try {
        const { medicationId, medicineName, dosage, notes } = req.body;
        
        const historyEntry = new MedicineHistory({
            user: req.user.id,
            medicationId,
            medicineName,
            dosage,
            notes,
            status: 'taken'
        });
        
        await historyEntry.save();
        res.status(201).json({ message: 'Medicine recorded successfully', data: historyEntry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMedicineHistory = async (req, res) => {
    try {
        const history = await MedicineHistory.find({ user: req.user.id })
            .sort({ takenAt: -1 });
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// New function: Mark medication status for a specific day
const markDayStatus = async (req, res) => {
    try {
        const { medicationId, date, day, status } = req.body;
        
        const medication = await Medication.findOne({
            _id: medicationId,
            user: req.user.id
        });

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        // Check if medication is scheduled for this day
        if (!medication.duration.includes(day)) {
            return res.status(400).json({ message: 'Medication not scheduled for this day' });
        }

        // Find existing status for this date
        const statusDate = new Date(date);
        statusDate.setHours(0, 0, 0, 0);
        
        const existingStatusIndex = medication.dailyStatus.findIndex(
            ds => ds.date.toDateString() === statusDate.toDateString()
        );

        if (existingStatusIndex >= 0) {
            // Update existing status
            medication.dailyStatus[existingStatusIndex].status = status;
            medication.dailyStatus[existingStatusIndex].takenAt = status === 'taken' ? new Date() : null;
        } else {
            // Add new status
            medication.dailyStatus.push({
                date: statusDate,
                day,
                status,
                takenAt: status === 'taken' ? new Date() : null
            });
        }

        await medication.save();

        // Also create history entry if taken
        if (status === 'taken') {
            const historyEntry = new MedicineHistory({
                user: req.user.id,
                medicationId: medication._id,
                medicineName: medication.name,
                dosage: medication.dosage,
                status: 'taken'
            });
            await historyEntry.save();
        }

        res.json({ message: 'Status updated successfully', medication });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get adherence statistics
const getAdherenceStats = async (req, res) => {
    try {
        const medications = await Medication.find({ user: req.user.id });
        
        let totalTaken = 0;
        let totalMissed = 0;
        
        medications.forEach(med => {
            med.dailyStatus.forEach(ds => {
                if (ds.status === 'taken') totalTaken++;
                if (ds.status === 'missed') totalMissed++;
            });
        });

        const totalDoses = totalTaken + totalMissed;
        const adherenceRate = totalDoses > 0 ? Math.round((totalTaken / totalDoses) * 100) : 0;

        res.json({
            taken: totalTaken,
            missed: totalMissed,
            adherenceRate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createMedication,
    getAllMedications,
    updateMedication,
    deleteMedication,
    recordMedicineTaken,
    getMedicineHistory,
    markDayStatus,
    getAdherenceStats
};