import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../utils/validators';
import logo from '../assets/logo.jpg';

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch {
      setError('root', { message: 'Credenciales inválidas' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card padding="lg" className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <img src={logo} alt="Freelance Estimator" className="w-full max-w-[280px] mx-auto rounded-lg" />
          <p className="text-primary text-sm mt-4 font-medium">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            labelClassName="text-primary"
            {...register('email', {
              required: 'Email requerido',
              validate: (v) => isValidEmail(v) || 'Email inválido',
            })}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            labelClassName="text-primary"
            {...register('password', { required: 'Contraseña requerida' })}
          />

          {errors.root && (
            <p className="text-danger text-sm text-center">{errors.root.message}</p>
          )}

          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            Iniciar sesión
          </Button>
        </form>

        <p className="text-center text-muted text-sm mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </Card>
    </div>
  );
}
