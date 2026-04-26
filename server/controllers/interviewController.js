const Interview = require('../models/Interview');

// GET /api/interviews
const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/interviews
const createInterview = async (req, res) => {
  try {
    const { companyName, roundName, topicsAsked, questionsPracticed, personalNotes, feedback, date } = req.body;

    if (!companyName) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    const interview = await Interview.create({
      user: req.user._id,
      companyName,
      roundName: roundName || '',
      topicsAsked: topicsAsked || [],
      questionsPracticed: questionsPracticed || [],
      personalNotes: personalNotes || '',
      feedback: feedback || '',
      date: date || Date.now(),
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/interviews/:id
const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: 'Interview entry not found' });
    }

    const fields = ['companyName', 'roundName', 'topicsAsked', 'questionsPracticed', 'personalNotes', 'feedback', 'date'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) interview[field] = req.body[field];
    });

    const updated = await interview.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/interviews/:id
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: 'Interview entry not found' });
    }
    res.json({ message: 'Interview entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInterviews, createInterview, updateInterview, deleteInterview };
