import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'accent';
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
    'font-medium rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 relative overflow-hidden';

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-5',
    lg: 'py-3.5 px-7 text-lg',
  };

  const variantStyles = {
    primary:
      disabled || loading
        ? 'bg-primary/50 text-white cursor-not-allowed'
        : 'bg-gradient-to-r from-primary to-primary-foreground/90 text-white hover:shadow-md hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 focus:ring-primary',
    secondary:
      disabled || loading
        ? 'bg-secondary/50 text-white cursor-not-allowed'
        : 'bg-gradient-to-r from-secondary to-secondary/80 text-white hover:shadow-md hover:shadow-secondary/25 hover:-translate-y-0.5 active:translate-y-0 focus:ring-secondary',
    outline:
      disabled || loading
        ? 'border border-muted text-muted-foreground cursor-not-allowed'
        : 'border border-primary text-primary-foreground hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 active:translate-y-0 focus:ring-primary',
    danger:
      disabled || loading
        ? 'bg-destructive/50 text-white cursor-not-allowed'
        : 'bg-gradient-to-r from-destructive to-destructive/80 text-white hover:shadow-md hover:shadow-destructive/25 hover:-translate-y-0.5 active:translate-y-0 focus:ring-destructive',
    accent:
      disabled || loading
        ? 'bg-accent/50 text-white cursor-not-allowed'
        : 'bg-gradient-to-r from-accent to-accent/80 text-white hover:shadow-md hover:shadow-accent/25 hover:-translate-y-0.5 active:translate-y-0 focus:ring-accent',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={props.type || 'button'}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center">
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {loading ? 'Processing...' : children}
      </span>
      {!disabled && !loading && variant !== 'outline' && (
        <span className="absolute inset-0 h-full w-full bg-white/10 scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
      )}
    </button>
  );
};

export default Button;
