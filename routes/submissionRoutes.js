const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createSubmission, getUserSubmissions } = require('../controllers/submissionController');

router.post('/', protect, createSubmission);
router.get('/user', protect, getUserSubmissions);

module.exports = router;