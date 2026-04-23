const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/auth');

router.post('/add-subject', authMiddleware.ensureAuthenticated, authMiddleware.ensureAdmin, questionController.addSubject);
router.post('/add-topic', authMiddleware.ensureAuthenticated, authMiddleware.ensureAdmin, questionController.addTopic);
router.post('/add-question', authMiddleware.ensureAuthenticated, authMiddleware.ensureAdmin, questionController.addQuestion);
router.get('/search', authMiddleware.ensureAuthenticated, questionController.searchQuestions);

module.exports = router;
