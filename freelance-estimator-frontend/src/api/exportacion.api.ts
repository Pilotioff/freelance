import api from './axios';

export type FormatoExportacion = 'pdf' | 'word' | 'excel';

export const exportacionApi = {
  exportar: async (cotizacionId: string, formato: FormatoExportacion): Promise<void> => {
    const res = await api.get(`/exportacion/${cotizacionId}`, {
      params: { formato },
      responseType: 'blob',
    });

    const disposition = res.headers['content-disposition'] as string | undefined;
    const match = disposition?.match(/filename="(.+)"/);
    const nombreArchivo = match?.[1] ?? `cotizacion.${formato === 'word' ? 'docx' : formato === 'excel' ? 'xlsx' : 'pdf'}`;

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
