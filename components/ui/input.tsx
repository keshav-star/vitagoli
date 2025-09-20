interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700
          focus:border-accent-primary dark:focus:border-accent-secondary
          focus:ring-2 focus:ring-accent-primary/20 dark:focus:ring-accent-secondary/20
          rounded-xl shadow-sm
          placeholder-gray-400 dark:placeholder-gray-600
          text-gray-900 dark:text-gray-100
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}