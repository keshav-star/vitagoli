import { QuizProvider } from '@/context/QuizContext';
import './globals.css';

export const metadata = {
  title: 'Quiz App',
  description: 'A simple quiz application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QuizProvider>
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}