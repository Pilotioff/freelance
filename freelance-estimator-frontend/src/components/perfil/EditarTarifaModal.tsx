import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { perfilProfesionalApi } from '../../api/perfil-profesional.api';
import { PerfilProfesional } from '../../types';

interface EditarTarifaModalProps {
  open: boolean;
  onClose: () => void;
  perfil: PerfilProfesional;
  onActualizado: () => void;
}

export function EditarTarifaModal({ open, onClose, perfil, onActualizado }: EditarTarifaModalProps) {
  const [valor, setValor] = useState(perfil.valor_hora_personalizado?.toString() ?? '');
  const [preferida, setPreferida] = useState<'manual' | 'sugerida'>(
    (perfil.tarifa_preferida as 'manual' | 'sugerida') ?? 'manual',
  );
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (open) {
      setValor(perfil.valor_hora_personalizado?.toString() ?? '');
      setPreferida((perfil.tarifa_preferida as 'manual' | 'sugerida') ?? 'manual');
    }
  }, [open, perfil]);

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await perfilProfesionalApi.actualizarTarifa({
        tarifa_hora_cop: valor ? Number(valor) : undefined,
        tarifa_preferida: preferida,
      });
      onActualizado();
      onClose();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar valor por hora">
      <div className="space-y-4">
        <Input
          label="Valor por hora personalizado (COP)"
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="90000"
        />

        <div>
          <label className="text-sm font-medium text-muted mb-2 block">¿Cuál tarifa usar en tus cotizaciones?</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                checked={preferida === 'sugerida'}
                onChange={() => setPreferida('sugerida')}
                className="accent-primary"
              />
              La recomendada por tu evaluación
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                checked={preferida === 'manual'}
                onChange={() => setPreferida('manual')}
                className="accent-primary"
              />
              Mi valor personalizado
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleGuardar} loading={guardando}>Guardar</Button>
        </div>
      </div>
    </Modal>
  );
}
