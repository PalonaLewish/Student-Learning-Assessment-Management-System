const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const quizRoutes = require('./routes/quiz');
const authMiddleware = require('./middleware/auth');
const { getAllSubjects } = require('./models/subjectModel');
const { getAllTopics } = require('./models/topicModel');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'learning-secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/auth', authRoutes);
app.use('/questions', questionRoutes);
app.use('/quiz', quizRoutes);

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.redirect('/auth/login');
});

app.get('/dashboard', authMiddleware.ensureAuthenticated, async (req, res) => {
  try {
    const subjects = await getAllSubjects();
    const topics = await getAllTopics();
    const message = req.query.message || null;
    const error = req.query.error || null;

    res.render('dashboard', {
      subjects,
      topics,
      searchResults: null,
      filters: {},
      message,
      error,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('dashboard', {
      subjects: [],
      topics: [],
      searchResults: null,
      filters: {},
      message: null,
      error: 'Unable to load dashboard data.',
    });
  }
});

app.use((req, res) => {
  res.status(404).render('404', { path: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
