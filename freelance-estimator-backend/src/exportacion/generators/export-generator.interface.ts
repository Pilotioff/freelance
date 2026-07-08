export interface DesgloseExportacion {
  diseno: number;
  frontend: number;
  backend: number;
  bd: number;
  infraestructura: number;
}

export interface DatosExportacion {
  numero_cotizacion: string;
  fecha: string;
  freelancer_nombre: string;
  freelancer_email: string;
  nombre_proyecto: string;
  tipo_proyecto: string;
  moneda: string;
  valor_hora: number;
  horas_estimadas: number;
  tiempo_entrega: string;
  tecnologias: string[];
  hosting: string;
  complejidad: string;
  desglose: DesgloseExportacion;
  margen_aplicado: number;
  costo_total: number;
  observaciones?: string;
}

export interface ExportGenerator {
  readonly contentType: string;
  readonly extension: string;
  generar(datos: DatosExportacion): Promise<Buffer>;
}
