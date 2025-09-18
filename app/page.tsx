'use client';

import { useQuiz } from '@/context/QuizContext';
import { useRouter } from 'next/navigation';
import { QuizLayout, Card, Button } from '@/components/ui';

export default function Home() {
  const router = useRouter();
  const { email, setEmail } = useQuiz();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      router.push('/quiz/1');
    }
  };

  return (
    <QuizLayout>
      <Card>
        <h1 className="text-2xl font-bold mb-4">Welcome to the Quiz!</h1>
        <p className="mb-4">Please enter your email to start the quiz:</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <Button type="submit">Start Quiz</Button>
        </form>
      </Card>
    </QuizLayout>
  );
}