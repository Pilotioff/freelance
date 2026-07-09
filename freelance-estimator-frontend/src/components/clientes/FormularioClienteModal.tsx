import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { clientesApi } from '../../api/clientes.api';
import { Cliente, CrearClientePayload, PERFILES_CLIENTE, PerfilCliente } from '../../types';

interface FormularioClienteModalProps {
  open: boolean;
  onClose: () => void;
  onGuardado: (cliente: Cliente) => void;
  clienteEditar?: Cliente | null;
}

interface FormValues {
  nombre: string;
  apellido: string;
  empresa?: string;
  correo?: string;
  telefono?: string;
  ciudad?: string;
  pais?: string;
  sitio_web?: string;
  linkedin?: string;
  tipo_cliente: PerfilCliente | '';
  observaciones?: string;
  activo: boolean;
}

const VALORES_INICIALES: FormValues = {
  nombre: '',
  apellido: '',
  empresa: '',
  correo: '',
  telefono: '',
  ciudad: '',
  pais: '',
  sitio_web: '',
  linkedin: '',
  tipo_cliente: '',
  observaciones: '',
  activo: true,
};

export function FormularioClienteModal({
  open,
  onClose,
  onGuardado,
  clienteEditar,
}: FormularioClienteModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ defaultValues: VALORES_INICIALES });

  useEffect(() => {
    if (open) {
      reset(
        clienteEditar
          ? {
              nombre: clienteEditar.nombre,
              apellido: clienteEditar.apellido,
              empresa: clienteEditar.empresa ?? '',
              correo: clienteEditar.correo ?? '',
              telefono: clienteEditar.telefono ?? '',
              ciudad: clienteEditar.ciudad ?? '',
              pais: clienteEditar.pais ?? '',
              sitio_web: clienteEditar.sitio_web ?? '',
              linkedin: clienteEditar.linkedin ?? '',
              tipo_cliente: clienteEditar.tipo_cliente as PerfilCliente,
              observaciones: clienteEditar.observaciones ?? '',
              activo: clienteEditar.activo,
            }
          : VALORES_INICIALES,
      );
    }
  }, [open, clienteEditar, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!data.tipo_cliente) {
      setError('tipo_cliente', { message: 'Selecciona un tipo de cliente' });
      return;
    }

    const payload: CrearClientePayload = {
      ...data,
      tipo_cliente: data.tipo_cliente,
    };

    try {
      const cliente = clienteEditar
        ? await clientesApi.actualizar(clienteEditar.id, payload)
        : await clientesApi.crear(payload);
      onGuardado(cliente);
      onClose();
    } catch {
      setError('root', { message: 'No se pudo guardar el cliente. Intenta de nuevo.' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={clienteEditar ? 'Editar cliente' : 'Nuevo cliente'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <Input label="Empresa" {...register('empresa')} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Correo"
            type="email"
            error={errors.correo?.message}
            {...register('correo')}
          />
          <Input label="Teléfono" {...register('telefono')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Ciudad" {...register('ciudad')} />
          <Input label="País" {...register('pais')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Sitio web" placeholder="https://..." {...register('sitio_web')} />
          <Input label="LinkedIn (opcional)" placeholder="https://linkedin.com/in/..." {...register('linkedin')} />
        </div>

        <div>
          <label className="text-sm font-medium text-muted mb-1.5 block">Tipo de cliente</label>
          <select
            {...register('tipo_cliente', { required: true })}
            className="w-full px-4 py-2.5 bg-background border border-slate-600 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona un tipo</option>
            {PERFILES_CLIENTE.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {errors.tipo_cliente && (
            <span className="text-xs text-danger mt-1 block">{errors.tipo_cliente.message}</span>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-muted mb-1.5 block">Observaciones</label>
          <textarea
            {...register('observaciones')}
            rows={3}
            className="w-full px-4 py-2.5 bg-background border border-slate-600 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" {...register('activo')} className="accent-primary" />
          Cliente activo
        </label>

        {errors.root && <p className="text-danger text-sm text-center">{errors.root.message}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting}>
            {clienteEditar ? 'Guardar cambios' : 'Crear cliente'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
