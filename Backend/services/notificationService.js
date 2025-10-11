const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Medication = require('../models/Medication.js');
const User = require('../models/userModel.js'); // Using your confirmed model filename
const moment = require('moment-timezone');

// Nodemailer transporter setup
// This reads the credentials from your .env file
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const startNotificationScheduler = () => {
    // Schedule a task to run every minute to check for reminders
    cron.schedule('* * * * *', async () => {
        console.log('Running cron job: Checking for medication reminders...');

        try {
            // Get the current time in the specified timezone
            const now = moment().tz("Asia/Kolkata");
            const currentTime = now.format('HH:mm'); // Format as "HH:mm" e.g., "14:30"

            // Find all medications that are scheduled for the current minute
            // The 'populate' command fetches the full user document (including email)
            const dueMedications = await Medication.find({ times: currentTime }).populate('user');

            if (dueMedications.length > 0) {
                console.log(`Found ${dueMedications.length} due medications for ${currentTime}.`);

                dueMedications.forEach(med => {
                    // Ensure the user and user's email exist before trying to send
                    if (med.user && med.user.email) {
                        const mailOptions = {
                            from: `"Medtrack Reminders" <${process.env.EMAIL_USER}>`,
                            to: med.user.email,
                            subject: `Reminder: Time for your ${med.pillName}`,
                            text: `Hello ${med.user.name},\n\nThis is a friendly reminder to take your medication: ${med.pillName} (${med.dosage}).\n\nStay healthy,\nThe Medtrack Team`,
                            html: `<p>Hello ${med.user.name},</p><p>This is a friendly reminder to take your medication: <strong>${med.pillName} (${med.dosage})</strong>.</p><p>Stay healthy,<br>The Medtrack Team</p>`
                        };

                        // Send the email
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error(`Error sending email to ${med.user.email}:`, error);
                            } else {
                                console.log(`Reminder email sent to ${med.user.email}: ${info.response}`);
                            }
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error occurred during cron job execution:', error);
        }
    });

    console.log('Notification scheduler started. Will run every minute.');
};

// Use module.exports to make this function available to server.js
module.exports = startNotificationScheduler;


