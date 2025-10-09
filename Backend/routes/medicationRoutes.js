// routes/medicationRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Import controller functions
const {
    createMedication,
    getAllMedications,
    updateMedication,
    deleteMedication
} = require('../controllers/medicationController');

// All routes in this file are protected, so we can apply the middleware at the top
router.use(authMiddleware);

// Define routes and map them to controller functions
router.route('/')
    .post(createMedication)
    .get(getAllMedications);

router.route('/:id')
    .put(updateMedication)
    .delete(deleteMedication);

module.exports = router;