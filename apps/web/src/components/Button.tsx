import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  loading = false,
  disabled,
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  ...props
}) => {
  const baseStyles =
    'font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };

  const variantStyles = {
    primary:
      disabled || loading
        ? 'bg-blue-300 text-white cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary:
      disabled || loading
        ? 'bg-gray-300 text-white cursor-not-allowed'
        : 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    outline:
      disabled || loading
        ? 'border border-gray-300 text-gray-400 cursor-not-allowed'
        : 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    danger:
      disabled || loading
        ? 'bg-red-300 text-white cursor-not-allowed'
        : 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={props.type || 'button'}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
};

export default Button;
