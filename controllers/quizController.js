const db = require('../config/db');
const {
  createQuiz,
  createResult,
  addQuizQuestions,
  getQuizQuestions,
  getResultsByUserId,
  getQuizById,
} = require('../models/quizModel');
const { getQuestionByIds, generateRandomQuiz } = require('../models/questionModel');

exports.startQuiz = async (req, res) => {
  try {
    const { subject_id, topic_id, difficulty } = req.body;
    const filters = {
      subject_id: subject_id || null,
      topic_id: topic_id || null,
      difficulty: difficulty || null,
      limit: 5,
    };

    const questionIds = await generateRandomQuiz(filters);
    if (!questionIds.length) {
      return res.redirect('/dashboard?error=No questions found matching the selected filters');
    }

    const quizId = await createQuiz(req.session.user.id);
    await createResult(quizId, 0);
    await addQuizQuestions(quizId, questionIds);

    const questions = await getQuestionByIds(questionIds);
    res.render('quiz', { questions, quizId, error: null });
  } catch (error) {
    console.error('Start quiz error:', error);
    res.redirect('/dashboard?error=Unable to start quiz');
  }
};

exports.submitQuiz = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { quiz_id, questionIds } = req.body;
    if (!quiz_id || !questionIds) {
      return res.redirect('/dashboard?error=Invalid quiz submission');
    }

    const parsedIds = Array.isArray(questionIds) ? questionIds : [questionIds];
    const quiz = await getQuizById(quiz_id);
    if (!quiz || quiz.user_id !== req.session.user.id) {
      return res.redirect('/dashboard?error=Quiz not found or access denied');
    }

    await connection.beginTransaction();

    let correctCount = 0;
    for (const questionId of parsedIds) {
      const selectedAnswer = req.body[`answer_${questionId}`] || null;
      const [questionRow] = await connection.execute(
        'SELECT correct_answer FROM Questions WHERE question_id = ?',
        [questionId]
      );
      const isCorrect = selectedAnswer === (questionRow[0] ? questionRow[0].correct_answer : null) ? 1 : 0;
      if (isCorrect) correctCount += 1;

      await connection.execute(
        'INSERT INTO Attempts (quiz_id, question_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)',
        [quiz_id, questionId, selectedAnswer, isCorrect]
      );
    }

    const score = Math.round((correctCount / parsedIds.length) * 100);
    await connection.execute('UPDATE Results SET score = ? WHERE quiz_id = ?', [score, quiz_id]);

    await connection.commit();
    res.redirect('/quiz/results');
  } catch (error) {
    await connection.rollback();
    console.error('Submit quiz error:', error);
    res.redirect('/dashboard?error=Unable to submit quiz');
  } finally {
    connection.release();
  }
};

exports.viewResults = async (req, res) => {
  try {
    const results = await getResultsByUserId(req.session.user.id);
    res.render('results', { results });
  } catch (error) {
    console.error('View results error:', error);
    res.redirect('/dashboard?error=Unable to load results');
  }
};
