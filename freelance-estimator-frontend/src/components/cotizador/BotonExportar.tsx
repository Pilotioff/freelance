import { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, File, Check, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { exportacionApi, FormatoExportacion } from '../../api/exportacion.api';

interface BotonExportarProps {
  cotizacionId: string;
}

const OPCIONES: { formato: FormatoExportacion; label: string; icon: React.ReactNode }[] = [
  { formato: 'pdf', label: 'Exportar como PDF', icon: <File size={16} /> },
  { formato: 'word', label: 'Exportar como Word', icon: <FileText size={16} /> },
  { formato: 'excel', label: 'Exportar como Excel', icon: <FileSpreadsheet size={16} /> },
];

export function BotonExportar({ cotizacionId }: BotonExportarProps) {
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState<FormatoExportacion | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function manejarClickFuera(e: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  const handleExportar = async (formato: FormatoExportacion, label: string) => {
    setAbierto(false);
    setCargando(formato);
    setError(null);
    setExito(null);
    try {
      await exportacionApi.exportar(cotizacionId, formato);
      setExito(`${label.replace('Exportar como ', '')} descargado correctamente.`);
      setTimeout(() => setExito(null), 4000);
    } catch {
      setError('No se pudo generar el archivo. Intenta de nuevo.');
      setTimeout(() => setError(null), 4000);
    } finally {
      setCargando(null);
    }
  };

  return (
    <div className="relative inline-block" ref={contenedorRef}>
      <Button
        variant="secondary"
        onClick={() => setAbierto((v) => !v)}
        loading={cargando !== null}
      >
        {cargando === null && <Download size={16} />}
        Exportar
        {cargando === null && <ChevronDown size={14} />}
      </Button>

      {abierto && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-slate-700 rounded-lg shadow-xl z-10 overflow-hidden">
          {OPCIONES.map((op) => (
            <button
              key={op.formato}
              onClick={() => handleExportar(op.formato, op.label)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-background transition text-left"
            >
              {op.icon}
              {op.label}
            </button>
          ))}
        </div>
      )}

      {exito && (
        <div className="absolute top-full mt-2 right-0 flex items-center gap-2 px-3 py-2 bg-success/20 text-success text-xs rounded-lg whitespace-nowrap">
          <Check size={14} /> {exito}
        </div>
      )}

      {error && (
        <div className="absolute top-full mt-2 right-0 px-3 py-2 bg-danger/20 text-danger text-xs rounded-lg whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}
