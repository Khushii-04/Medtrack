// models/Medication.js
const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assumes you have a 'User' model
        required: true
    },
    pillName: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequency: {
        type: String, // e.g., 'Daily', 'Twice a day'
        required: true
    },
    times: [{ // An array to store multiple times, e.g., ["08:00", "20:00"]
        type: String,
        required: true
    }],
    // You can add more fields like 'startDate', 'instructions', etc.
}, { timestamps: true });

const Medication = mongoose.model('Medication', medicationSchema);
module.exports = Medication;