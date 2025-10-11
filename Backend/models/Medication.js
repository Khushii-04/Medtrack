const mongoose = require('mongoose');

const dailyStatusSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    status: {
        type: String,
        enum: ['taken', 'missed', 'pending'],
        default: 'pending'
    },
    takenAt: {
        type: Date
    }
});

const medicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequency: {
        type: Number,
        required: true
    },
    duration: [{
        type: String,
        required: true
    }],
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['taken', 'missed', 'pending'],
        default: 'pending'
    },
    dailyStatus: [dailyStatusSchema]  // ✅ Use the schema defined above
}, { timestamps: true });

const Medication = mongoose.model('Medication', medicationSchema);
module.exports = Medication;