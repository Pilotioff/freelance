import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { TablaClientes } from '../components/clientes/TablaClientes';
import { FormularioClienteModal } from '../components/clientes/FormularioClienteModal';
import { PerfilClienteModal } from '../components/clientes/PerfilClienteModal';
import { useClientes } from '../hooks/useClientes';
import { Cliente, ClienteConMetricas, DetalleCliente } from '../types';

export function Clientes() {
  const {
    clientes,
    total,
    loading,
    error,
    filtros,
    busquedaInput,
    setBusquedaInput,
    cambiarFiltro,
    cambiarOrden,
    irAPagina,
    recargar,
  } = useClientes();

  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [clienteEditar, setClienteEditar] = useState<Cliente | null>(null);
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState<string | null>(null);

  const abrirNuevo = () => {
    setClienteEditar(null);
    setFormularioAbierto(true);
  };

  const abrirEditar = (cliente: DetalleCliente) => {
    setClienteSeleccionadoId(null);
    setClienteEditar(cliente);
    setFormularioAbierto(true);
  };

  const handleSeleccionar = (cliente: ClienteConMetricas) => {
    setClienteSeleccionadoId(cliente.id);
  };

  const handleGuardado = () => {
    recargar();
  };

  const handleEliminado = () => {
    recargar();
  };

  return (
    <AppLayout
      title="Clientes"
      navbarExtra={
        <Button onClick={abrirNuevo}>
          <UserPlus size={16} />
          Nuevo cliente
        </Button>
      }
    >
      {error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <TablaClientes
          clientes={clientes}
          total={total}
          loading={loading}
          filtros={filtros}
          busquedaInput={busquedaInput}
          onBusquedaChange={setBusquedaInput}
          onFiltroChange={cambiarFiltro}
          onOrdenChange={cambiarOrden}
          onPaginaChange={irAPagina}
          onSeleccionar={handleSeleccionar}
        />
      )}

      <FormularioClienteModal
        open={formularioAbierto}
        onClose={() => setFormularioAbierto(false)}
        onGuardado={handleGuardado}
        clienteEditar={clienteEditar}
      />

      <PerfilClienteModal
        clienteId={clienteSeleccionadoId}
        onClose={() => setClienteSeleccionadoId(null)}
        onEditar={abrirEditar}
        onEliminado={handleEliminado}
      />
    </AppLayout>
  );
}
