const bcrypt = require('bcrypt');
const { findUserByEmail, createUser } = require('../models/userModel');

const saltRounds = 10;

exports.showLogin = (req, res) => {
  res.render('login', {
    error: req.query.error || null,
    success: req.query.success || null,
  });
};

exports.showRegister = (req, res) => {
  res.render('register', {
    error: req.query.error || null,
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.redirect('/auth/register?error=All fields are required');
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.redirect('/auth/register?error=Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await createUser(name, email, hashedPassword, role);

    res.redirect('/auth/login?success=Registration successful. Please login.');
  } catch (error) {
    console.error('Registration error:', error);
    res.redirect('/auth/register?error=Unable to register user.');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.redirect('/auth/login?error=Please enter email and password');
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.redirect('/auth/login?error=Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.redirect('/auth/login?error=Invalid email or password');
    }

    req.session.user = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.redirect('/auth/login?error=Unable to login.');
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
};
