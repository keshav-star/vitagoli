import { QuizProvider } from '@/context/QuizContext';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Vitagoli - AI-Powered Quiz Platform',
  description: 'Challenge yourself with our adaptive quiz experience powered by AI',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} antialiased`}
      style={{
        colorScheme: 'dark',
      }}
    >
      <body className="relative min-h-screen bg-white dark:bg-gray-900">
        <ThemeProvider />
        <QuizProvider>{children}</QuizProvider>
      </body>
    </html>
  );
}