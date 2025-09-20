'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizLayout, Card, Button } from '@/components/ui';
import { generateQuiz } from '@/app/actions';
import { LoadingSpinner } from '@/components/loading';

const predefinedTopics = [
  { id: 'javascript', name: 'JavaScript', icon: '📜' },
  { id: 'react', name: 'React', icon: '⚛️' },
  { id: 'nodejs', name: 'Node.js', icon: '💻' },
  { id: 'databases', name: 'Databases', icon: '🗄️' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
  { id: 'python', name: 'Python', icon: '🐍' },
];

export default function QuizStart() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const topic = selectedTopic === 'custom' ? customTopic : 
      predefinedTopics.find(t => t.id === selectedTopic)?.name || '';
    
    if (!topic) return;

    setIsLoading(true);
    try {
      const result = await generateQuiz({ topic });
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate quiz');
      }

      router.push(`/quiz/${result.sessionId}`);
    } catch (error) {
      console.error('Error generating quiz:', error);
      // You might want to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QuizLayout>
      <Card gradient className="max-w-2xl mx-auto">
        <div className="space-y-8 p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Choose Your Topic</h1>
            <p className="text-gray-600">
              Select a predefined topic or create your own custom quiz
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {predefinedTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`p-4 rounded-xl transition-all ${
                  selectedTopic === topic.id
                    ? 'bg-indigo-100 ring-2 ring-indigo-500'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              >
                <div className="text-2xl mb-2">{topic.icon}</div>
                <div className="font-medium">{topic.name}</div>
              </button>
            ))}
            <button
              onClick={() => setSelectedTopic('custom')}
              className={`p-4 rounded-xl transition-all ${
                selectedTopic === 'custom'
                  ? 'bg-indigo-100 ring-2 ring-indigo-500'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            >
              <div className="text-2xl mb-2">✨</div>
              <div className="font-medium">Custom Topic</div>
            </button>
          </div>

          {selectedTopic === 'custom' && (
            <div className="space-y-2">
              <label htmlFor="customTopic" className="block font-medium">
                Enter Your Topic
              </label>
              <input
                type="text"
                id="customTopic"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g., Machine Learning, Web Security"
                className="w-full p-3 rounded-lg border bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!selectedTopic || (selectedTopic === 'custom' && !customTopic)}
              variant="primary"
              size="lg"
              className="min-w-[200px]"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Generating...</span>
                </div>
              ) : (
                'Start Quiz'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </QuizLayout>
  );
}