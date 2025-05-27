import React from 'react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  className?: string;
  containerClassName?: string;
  error?: string;
  startAdornment?: React.ReactNode;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  id,
  className = '',
  containerClassName = '',
  error,
  startAdornment,
  ...props
}) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <div className={startAdornment ? 'relative' : ''}>
        {startAdornment && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
            {startAdornment}
          </span>
        )}
        <input
          id={id}
          className={`w-full ${startAdornment ? 'pl-7' : 'px-3'} py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} ${error ? 'border-red-500' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextField;
