const db = require('../config/db');

exports.addQuestion = async (
  topicId,
  question,
  optionA,
  optionB,
  optionC,
  optionD,
  correctAnswer,
  difficulty
) => {
  const [result] = await db.execute(
    'INSERT INTO Questions (topic_id, question, optionA, optionB, optionC, optionD, correct_answer, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [topicId, question, optionA, optionB, optionC, optionD, correctAnswer, difficulty]
  );
  return result.insertId;
};

exports.searchQuestions = async ({ subject_id, topic_id, difficulty }) => {
  const whereClauses = [];
  const params = [];

  if (subject_id) {
    whereClauses.push('s.subject_id = ?');
    params.push(subject_id);
  }
  if (topic_id) {
    whereClauses.push('t.topic_id = ?');
    params.push(topic_id);
  }
  if (difficulty) {
    whereClauses.push('q.difficulty = ?');
    params.push(difficulty);
  }

  const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const [rows] = await db.execute(
    `SELECT q.*, t.topic_name, s.subject_name
     FROM Questions q
     JOIN Topics t ON q.topic_id = t.topic_id
     JOIN Subjects s ON t.subject_id = s.subject_id
     ${where}
     ORDER BY q.difficulty, s.subject_name, t.topic_name`,
    params
  );
  return rows;
};

exports.generateRandomQuiz = async ({ subject_id, topic_id, difficulty, limit }) => {
  const [rows] = await db.query('CALL generate_random_quiz(?, ?, ?, ?)', [
    subject_id || null,
    topic_id || null,
    difficulty || null,
    limit || 5,
  ]);
  const questionRows = rows[0] || [];
  return questionRows.map((row) => row.question_id);
};

exports.getQuestionByIds = async (ids) => {
  if (!ids.length) return [];
  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await db.execute(
    `SELECT q.*, t.topic_name, s.subject_name
     FROM Questions q
     JOIN Topics t ON q.topic_id = t.topic_id
     JOIN Subjects s ON t.subject_id = s.subject_id
     WHERE q.question_id IN (${placeholders})`,
    ids
  );
  return rows;
};
