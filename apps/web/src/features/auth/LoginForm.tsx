import Button from '@/components/Button';
import TextField from '@/components/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@mini-wallet/store';
import { LoginCredentials, loginCredentialsSchema } from '@mini-wallet/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface LoginFormProps {
  onSuccess: () => void;
}

type LoginFormValues = LoginCredentials;

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginCredentialsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const success = await login(data);
    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <div className="mb-6 p-3 border border-destructive/30 rounded-md bg-destructive/10 text-destructive flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <TextField
            id="email"
            label="Email"
            type="email"
            {...register('email')}
            placeholder="Enter your email"
            error={errors.email?.message}
            startAdornment={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-muted-foreground"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
          />
        </div>

        <div className="mb-6">
          <TextField
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="Enter your password"
            error={errors.password?.message}
            startAdornment={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-muted-foreground"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            }
          />
        </div>

        <div className="mb-6 p-3 border border-muted/30 rounded-md bg-muted/10 text-muted-foreground">
          <p className="text-xs">
            <span className="font-semibold">Demo credentials:</span>
            <br />
            Email: <span className="text-primary-foreground">user@example.com</span>
            <br />
            Password: <span className="text-primary-foreground">password</span>
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Authenticating...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
