import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Medication from '../models/Medication.js';
import User from '../models/userModel.js';
import moment from 'moment-timezone';

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const startNotificationScheduler = () => {
    // Schedule a task to run every minute
    cron.schedule('* * * * *', async () => {
        console.log('Running cron job: Checking for medication reminders...');

        try {
            const now = moment().tz("Asia/Kolkata"); // Use a specific timezone
            const currentHour = now.format('HH');
            const currentMinute = now.format('mm');
            const currentTime = `${currentHour}:${currentMinute}`; // Format: HH:mm

            // Find medications scheduled for the current time
            const dueMedications = await Medication.find({ times: currentTime }).populate('user');

            if (dueMedications.length > 0) {
                console.log(`Found ${dueMedications.length} due medications.`);
                dueMedications.forEach(med => {
                    if (med.user && med.user.email) {
                        const mailOptions = {
                            from: process.env.EMAIL_USER,
                            to: med.user.email,
                            subject: `Medication Reminder: ${med.pillName}`,
                            text: `Hello ${med.user.name},\n\nThis is a reminder to take your medication: ${med.pillName} (${med.dosage}).\n\nThank you,\nMedtrack`,
                        };

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
            console.error('Error in cron job:', error);
        }
    });
};

export default startNotificationScheduler;
