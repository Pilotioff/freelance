import { UserPlus } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { TablaClientes } from '../components/clientes/TablaClientes';
import { useClientes } from '../hooks/useClientes';

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
  } = useClientes();

  return (
    <AppLayout
      title="Clientes"
      navbarExtra={
        <Button>
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
          onSeleccionar={() => { /* se conecta en Fase C con el perfil de cliente */ }}
        />
      )}
    </AppLayout>
  );
}
