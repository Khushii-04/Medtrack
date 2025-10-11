const mongoose = require('mongoose');

const medicineHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medication',
        required: true
    },
    medicineName: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['taken', 'missed'],
        default: 'taken'
    },
    notes: {
        type: String
    },
    takenAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('MedicineHistory', medicineHistorySchema);