'use client';

interface ShareButtonProps {
  topic: string;
  score: number;
}

export function ShareButton({ topic, score }: ShareButtonProps) {
  return (
    <button 
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: `Quiz Result: ${topic}`,
            text: `I scored ${score}/5 on the ${topic} quiz!`,
            url: window.location.href
          }).catch(() => {});
        }
      }}
      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Share Results
    </button>
  );
}