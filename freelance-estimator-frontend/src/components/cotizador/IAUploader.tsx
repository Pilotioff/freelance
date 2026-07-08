import { useCallback, useState } from 'react';
import { Upload, FileText, Image } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import { ConfidenceBadge } from '../ui/ConfidenceBadge';
import { ResultadoIA } from '../../types';

interface IAUploaderProps {
  onAnalizar: (file: File, tipo: 'documento' | 'mockup') => void;
  loading: boolean;
  error: string | null;
  resultado: ResultadoIA | null;
}

export function IAUploader({ onAnalizar, loading, error, resultado }: IAUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [tipoArchivo, setTipoArchivo] = useState<'documento' | 'mockup'>('mockup');

  const handleFile = useCallback(
    (file: File) => {
      const esImagen = file.type.startsWith('image/');
      const esPdf = file.type === 'application/pdf';
      if (!esImagen && !esPdf) return;

      const tipo = esPdf ? 'documento' : 'mockup';
      setTipoArchivo(tipo);

      if (esImagen) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      onAnalizar(file, tipo);
    },
    [onAnalizar],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition ${
          dragOver ? 'border-ia bg-ia/5' : 'border-ia/50'
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-ia font-medium">Analizando con IA...</p>
          </div>
        ) : preview ? (
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-4" />
        ) : (
          <Upload className="mx-auto text-ia mb-4" size={48} />
        )}

        {!loading && (
          <>
            <p className="text-foreground font-medium">
              Arrastra un mockup (PNG/JPG) o PDF aquí
            </p>
            <p className="text-muted text-sm mt-2">o</p>
            <label className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-ia/20 text-ia rounded-lg cursor-pointer hover:bg-ia/30 transition">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              Seleccionar archivo
            </label>
            <div className="flex justify-center gap-4 mt-4 text-muted text-xs">
              <span className="flex items-center gap-1"><Image size={14} /> Mockup</span>
              <span className="flex items-center gap-1"><FileText size={14} /> PDF</span>
            </div>
          </>
        )}
      </div>

      {error && <p className="text-danger text-sm text-center">{error}</p>}

      {resultado && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ConfidenceBadge confianza={resultado.confianza_estimacion} />
            <span className="text-muted text-sm">
              {tipoArchivo === 'mockup' ? 'Análisis de mockup' : 'Análisis de documento'}
            </span>
          </div>

          {resultado.supuestos.length > 0 && (
            <div className="bg-card border border-slate-700 rounded-xl p-4">
              <h4 className="text-ia text-sm font-semibold mb-2">Supuestos de la IA</h4>
              <ul className="space-y-1">
                {resultado.supuestos.map((s, i) => (
                  <li key={i} className="text-muted text-sm flex items-start gap-2">
                    <span className="text-ia mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
