const db = require('../config/db');

exports.getTopicsBySubject = async (subjectId) => {
  const [rows] = await db.execute('SELECT * FROM Topics WHERE subject_id = ? ORDER BY topic_name', [subjectId]);
  return rows;
};

exports.getAllTopics = async () => {
  const [rows] = await db.execute(
    'SELECT t.*, s.subject_name FROM Topics t JOIN Subjects s ON t.subject_id = s.subject_id ORDER BY s.subject_name, t.topic_name'
  );
  return rows;
};

exports.addTopic = async (subjectId, topicName) => {
  const [result] = await db.execute(
    'INSERT INTO Topics (subject_id, topic_name) VALUES (?, ?)',
    [subjectId, topicName]
  );
  return result.insertId;
};
