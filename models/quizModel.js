const db = require('../config/db');

exports.createQuiz = async (userId) => {
  const [result] = await db.execute('INSERT INTO Quiz (user_id, date) VALUES (?, NOW())', [userId]);
  return result.insertId;
};

exports.createResult = async (quizId, score) => {
  const [result] = await db.execute('INSERT INTO Results (quiz_id, score) VALUES (?, ?)', [quizId, score]);
  return result.insertId;
};

exports.addQuizQuestions = async (quizId, questionIds) => {
  if (!questionIds.length) return;
  const values = questionIds.map((id) => [quizId, id]);
  await db.query('INSERT INTO Quiz_Questions (quiz_id, question_id) VALUES ?', [values]);
};

exports.getQuizById = async (quizId) => {
  const [rows] = await db.execute('SELECT * FROM Quiz WHERE quiz_id = ?', [quizId]);
  return rows[0] || null;
};

exports.getResultsByUserId = async (userId) => {
  const [rows] = await db.execute(
    `SELECT r.result_id, r.quiz_id, r.score, q.date
     FROM Results r
     JOIN Quiz q ON r.quiz_id = q.quiz_id
     WHERE q.user_id = ?
     ORDER BY q.date DESC`,
    [userId]
  );
  return rows;
};

exports.getQuizQuestions = async (quizId) => {
  const [rows] = await db.execute(
    `SELECT q.*, t.topic_name, s.subject_name
     FROM Quiz_Questions qq
     JOIN Questions q ON qq.question_id = q.question_id
     JOIN Topics t ON q.topic_id = t.topic_id
     JOIN Subjects s ON t.subject_id = s.subject_id
     WHERE qq.quiz_id = ?`,
    [quizId]
  );
  return rows;
};
