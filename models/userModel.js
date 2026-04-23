const db = require('../config/db');

exports.findUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0] || null;
};

exports.createUser = async (name, email, password, role) => {
  const [result] = await db.execute(
    'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return result.insertId;
};

exports.getUserById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM Users WHERE user_id = ?', [id]);
  return rows[0] || null;
};
