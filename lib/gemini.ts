import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Please define the GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

export async function generateQuestions(topic: string): Promise<Question[]> {
  const prompt = `Generate 5 multiple-choice questions about ${topic}. 
  Each question should have 4 options and one correct answer.
  Format your response as a JSON array of questions where each question has:
  - id (number 1-5)
  - question (string)
  - options (array of 4 strings)
  - correctAnswer (string matching one of the options exactly)
  
  Make sure questions are challenging but fair, and cover different aspects of ${topic}.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const formattedText = text.replace(/```json\n?|\n?```/g, ''); // Remove markdown code blocks if present
    const questions: Question[] = JSON.parse(formattedText);
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions');
  }
}

export async function generateFeedback(
  topic: string,
  questions: Question[],
  userAnswers: string[]
): Promise<string> {
  const correctAnswers = questions.map(q => q.correctAnswer);
  const score = userAnswers.reduce(
    (acc, ans, i) => acc + (ans === correctAnswers[i] ? 1 : 0),
    0
  );

  const prompt = `The user took a quiz about ${topic} and got ${score} out of 5 questions correct.
  
  Here are the questions and their responses:
  ${questions.map((q, i) => `
  Q${i + 1}: ${q.question}
  User's answer: ${userAnswers[i]}
  Correct answer: ${q.correctAnswer}
  `).join('\n')}
  
  Please provide detailed, constructive feedback about their performance. Include:
  1. Areas where they did well
  2. Concepts they might need to review
  3. Specific resources or tips for improvement
  4. Encouragement for further learning
  
  Keep the tone positive and supportive.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw new Error('Failed to generate feedback');
  }
}