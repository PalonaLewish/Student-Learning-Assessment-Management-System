const {
  addSubject,
  getAllSubjects,
} = require('../models/subjectModel');
const {
  addTopic,
  getTopicsBySubject,
  getAllTopics,
} = require('../models/topicModel');
const {
  addQuestion,
  searchQuestions,
} = require('../models/questionModel');

exports.addSubject = async (req, res) => {
  try {
    const { subject_name } = req.body;
    if (!subject_name) {
      return res.redirect('/dashboard?error=Subject name is required');
    }
    await addSubject(subject_name);
    res.redirect('/dashboard?message=Subject added successfully');
  } catch (error) {
    console.error('Add subject error:', error);
    res.redirect('/dashboard?error=Unable to add subject');
  }
};

exports.addTopic = async (req, res) => {
  try {
    const { subject_id, topic_name } = req.body;
    if (!subject_id || !topic_name) {
      return res.redirect('/dashboard?error=Topic name and subject are required');
    }
    await addTopic(subject_id, topic_name);
    res.redirect('/dashboard?message=Topic added successfully');
  } catch (error) {
    console.error('Add topic error:', error);
    res.redirect('/dashboard?error=Unable to add topic');
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const {
      topic_id,
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correct_answer,
      difficulty,
    } = req.body;

    if (!topic_id || !question || !optionA || !optionB || !optionC || !optionD || !correct_answer || !difficulty) {
      return res.redirect('/dashboard?error=All question fields are required');
    }

    await addQuestion(topic_id, question, optionA, optionB, optionC, optionD, correct_answer, difficulty);
    res.redirect('/dashboard?message=Question added successfully');
  } catch (error) {
    console.error('Add question error:', error);
    res.redirect('/dashboard?error=Unable to add question');
  }
};

exports.searchQuestions = async (req, res) => {
  try {
    const filters = {
      subject_id: req.query.subject_id || null,
      topic_id: req.query.topic_id || null,
      difficulty: req.query.difficulty || null,
    };

    const subjects = await getAllSubjects();
    const topics = await getAllTopics();
    const searchResults = await searchQuestions(filters);

    res.render('dashboard', {
      subjects,
      topics,
      searchResults,
      filters,
      message: null,
      error: null,
    });
  } catch (error) {
    console.error('Search questions error:', error);
    res.redirect('/dashboard?error=Unable to search questions');
  }
};
