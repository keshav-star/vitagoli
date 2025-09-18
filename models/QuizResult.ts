import mongoose, { Document } from 'mongoose';

// Define the interface for Quiz Result
export interface IQuizResult extends Document {
  answers: Array<{
    questionId: number;
    answer: string;
    isCorrect: boolean;
  }>;
  score: number;
  email: string;
  recommendation: string;
  createdAt: Date;
}

const QuizResultSchema = new mongoose.Schema({
  answers: [{
    questionId: {
      type: Number,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  }],
  score: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  recommendation: {
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