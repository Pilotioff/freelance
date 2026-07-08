import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail, minLength } from '../utils/validators';

interface RegisterForm {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  empresa?: string;
  tarifa_hora_cop?: number;
}

export function Register() {
  const { registro } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registro(data);
      navigate('/dashboard');
    } catch {
      setError('root', { message: 'Error al crear la cuenta' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card padding="lg" className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <h1 className="text-primary font-bold text-2xl tracking-wide">
            FREELANCE ESTIMATOR
          </h1>
          <p className="text-muted text-sm mt-2">Crea tu cuenta gratuita</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nombre"
              error={errors.nombre?.message}
              {...register('nombre', { required: 'Requerido' })}
            />
            <Input
              label="Apellido"
              error={errors.apellido?.message}
              {...register('apellido', { required: 'Requerido' })}
            />
          </div>
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email requerido',
              validate: (v) => isValidEmail(v) || 'Email inválido',
            })}
          />
          <Input
            label="Contraseña"
            type="password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Contraseña requerida',
              validate: (v) => minLength(v, 8) || 'Mínimo 8 caracteres',
            })}
          />
          <Input
            label="Empresa (opcional)"
            {...register('empresa')}
          />
          <Input
            label="Tarifa por hora COP (opcional)"
            type="number"
            placeholder="150000"
            {...register('tarifa_hora_cop', { valueAsNumber: true })}
          />

          {errors.root && (
            <p className="text-danger text-sm text-center">{errors.root.message}</p>
          )}

          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            Crear cuenta
          </Button>
        </form>

        <p className="text-center text-muted text-sm mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}
