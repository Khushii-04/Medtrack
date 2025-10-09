// controllers/medicationController.js

const Medication = require('../models/Medication');

/**
 * @description Create a new medication schedule
 * @route POST /api/medications
 * @access Private
 */
const createMedication = async (req, res) => {
    try {
        const { pillName, dosage, frequency, times } = req.body;
        const newMedication = new Medication({
            user: req.user.id,
            pillName,
            dosage,
            frequency,
            times
        });
        const savedMedication = await newMedication.save();
        res.status(201).json(savedMedication);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @description Get all medications for a user
 * @route GET /api/medications
 * @access Private
 */
const getAllMedications = async (req, res) => {
    try {
        const medications = await Medication.find({ user: req.user.id });
        res.json(medications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @description Update an existing medication
 * @route PUT /api/medications/:id
 * @access Private
 */
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

/**
 * @description Delete a medication
 * @route DELETE /api/medications/:id
 * @access Private
 */
const deleteMedication = async (req, res) => {
    try {
        const deletedMedication = await Medication.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!deletedMedication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        res.json({ message: 'Medication deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    createMedication,
    getAllMedications,
    updateMedication,
    deleteMedication
};