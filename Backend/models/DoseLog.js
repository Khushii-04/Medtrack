// models/DoseLog.js
const mongoose = require('mongoose');

const doseLogSchema = new mongoose.Schema({
    medication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medication',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['taken', 'missed'], // Enforce specific values
        required: true
    },
    scheduledTime: { // The time the dose was supposed to be taken
        type: Date,
        required: true
    },
    loggedAt: { // The time the user actually logged it
        type: Date,
        default: Date.now
    }
});

const DoseLog = mongoose.model('DoseLog', doseLogSchema);
module.exports = DoseLog;