'use client';

export function ThemeProvider() {
  return (
    <style jsx global>{`
      :root {
        --color-accent-primary: #2227FF;
        --color-accent-secondary: #7377FF;
      }
      .dark {
        --color-accent-primary: #4A4FFF;
        --color-accent-secondary: #7377FF;
      }
    `}</style>
  );
}