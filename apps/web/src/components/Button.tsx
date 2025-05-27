import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      type={props.type || 'button'}
      disabled={disabled || loading}
      className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-150 ${
        disabled || loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      } ${className}`}
      {...props}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
};

export default Button;
