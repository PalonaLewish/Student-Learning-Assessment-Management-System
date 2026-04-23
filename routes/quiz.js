const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/auth');

router.post('/start', authMiddleware.ensureAuthenticated, authMiddleware.ensureStudent, quizController.startQuiz);
router.post('/submit', authMiddleware.ensureAuthenticated, authMiddleware.ensureStudent, quizController.submitQuiz);
router.get('/results', authMiddleware.ensureAuthenticated, authMiddleware.ensureStudent, quizController.viewResults);

module.exports = router;
