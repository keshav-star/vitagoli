import mongoose, { Document } from 'mongoose';

// Define question interface
export interface IQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

// Define the interface for Quiz Result
export interface IQuizResult extends Document {
  topic: string;
  questions: IQuestion[];
  answers: string[];
  score: number;
  feedback: string;
  createdAt: Date;
}

const QuestionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: String,
    required: true,
  },
});

const QuizResultSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  questions: {
    type: [QuestionSchema],
    required: true,
  },
  answers: {
    type: [String],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate model compilation error in development
const QuizResult = mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema);

export default QuizResult;