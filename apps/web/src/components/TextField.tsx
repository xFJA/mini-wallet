import React from 'react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  className?: string;
  containerClassName?: string;
  error?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  id,
  className = '',
  containerClassName = '',
  error,
  startAdornment,
  endAdornment,
  ...props
}) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label htmlFor={id} className="block text-primary-foreground text-sm font-medium mb-2">
        {label}
      </label>
      <div className={startAdornment || endAdornment ? 'relative' : ''}>
        {startAdornment && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startAdornment}
          </span>
        )}
        {endAdornment && (
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center">{endAdornment}</span>
        )}
        <input
          id={id}
          className={`w-full ${startAdornment ? 'pl-10' : 'pl-4'} ${endAdornment ? 'pr-10' : 'pr-4'} py-3 bg-muted/20 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-primary-foreground placeholder:text-muted-foreground transition-all duration-200 ${className} ${error ? 'border-destructive focus:ring-destructive focus:border-destructive' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-destructive flex items-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default TextField;
