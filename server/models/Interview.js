const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  roundName: {
    type: String,
    trim: true,
    default: '',
  },
  topicsAsked: {
    type: [String],
    default: [],
  },
  questionsPracticed: {
    type: [String],
    default: [],
  },
  personalNotes: {
    type: String,
    default: '',
  },
  feedback: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
