const db = require('../config/db');

exports.getAllSubjects = async () => {
  const [rows] = await db.execute('SELECT * FROM Subjects ORDER BY subject_name');
  return rows;
};

exports.addSubject = async (subjectName) => {
  const [result] = await db.execute('INSERT INTO Subjects (subject_name) VALUES (?)', [subjectName]);
  return result.insertId;
};
