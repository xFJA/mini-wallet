import Button from '@/components/Button';
import TextField from '@/components/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@mini-wallet/store';
import { LoginCredentials, loginCredentialsSchema } from '@mini-wallet/types';
import { useForm } from 'react-hook-form';

interface LoginFormProps {
  onSuccess: () => void;
}

type LoginFormValues = LoginCredentials;

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading, error } = useAuth();

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
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mini Wallet</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="email"
          label="Email"
          type="email"
          {...register('email')}
          placeholder="Enter your email"
          error={errors.email?.message}
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          {...register('password')}
          placeholder="Enter your password"
          error={errors.password?.message}
          containerClassName="mb-6"
        />

        <p className="mt-1 text-xs text-gray-500">
          Demo credentials: email: user@example.com, password: password
        </p>

        <Button type="submit" variant="primary" size="md" loading={isLoading} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
