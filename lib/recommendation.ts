type RecommendationLevel = {
  threshold: number;
  message: string;
};

type RecommendationLevels = {
  beginner: RecommendationLevel;
  intermediate: RecommendationLevel;
  advanced: RecommendationLevel;
  expert: RecommendationLevel;
};

type QuizAnswer = {
  questionId: number;
  answer: string;
  isCorrect: boolean;
};

type QuizResult = {
  score: number;
  recommendation: string;
};

// Define score thresholds and their corresponding recommendations
const RECOMMENDATIONS: RecommendationLevels = {
  beginner: {
    threshold: 2,
    message: "Keep learning! We recommend starting with the basics and practicing regularly.",
  },
  intermediate: {
    threshold: 3,
    message: "Good job! Focus on the topics you missed and try to deepen your understanding.",
  },
  advanced: {
    threshold: 4,
    message: "Excellent work! Consider exploring advanced topics and helping others learn.",
  },
  expert: {
    threshold: 5,
    message: "Perfect score! You've mastered these concepts. Time to tackle new challenges!",
  },
};

/**
 * Calculates score and generates personalized recommendation based on quiz answers
 * @param answers Array of answer objects
 * @returns Object containing score and recommendation
 */
export function computeQuizResult(answers: QuizAnswer[]): QuizResult {
  // Validate answers
  if (!Array.isArray(answers) || answers.length !== 5) {
    throw new Error('Invalid answers format');
  }

  // Calculate score (implementation depends on your scoring logic)
  const score = answers.filter(answer => answer.isCorrect).length;

  // Get appropriate recommendation based on score
  let recommendation;
  if (score <= RECOMMENDATIONS.beginner.threshold) {
    recommendation = RECOMMENDATIONS.beginner.message;
  } else if (score <= RECOMMENDATIONS.intermediate.threshold) {
    recommendation = RECOMMENDATIONS.intermediate.message;
  } else if (score <= RECOMMENDATIONS.advanced.threshold) {
    recommendation = RECOMMENDATIONS.advanced.message;
  } else {
    recommendation = RECOMMENDATIONS.expert.message;
  }

  return {
    score,
    recommendation,
  };
}