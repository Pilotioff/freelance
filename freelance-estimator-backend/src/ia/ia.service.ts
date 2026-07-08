import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pdfParse from 'pdf-parse';
import {
  ResultadoIA,
  validateResultadoIA,
  mapMockupResponse,
  normalizarResultadoIA,
} from './dto/resultado-ia.dto';
import {
  buildDocumentoPrompt,
  buildDocumentoPromptStrict,
} from './prompts/documento.prompt';
import {
  buildMockupPrompt,
  buildMockupPromptStrict,
} from './prompts/mockup.prompt';

interface OllamaResponse {
  response: string;
}

interface OllamaRequestBody {
  model: string;
  prompt: string;
  stream: boolean;
  images?: string[];
}

@Injectable()
export class IaService {
  private readonly logger = new Logger(IaService.name);
  private readonly TIMEOUT_MS = 600000; // 10 minutos para inferencia en CPU

  constructor(private readonly configService: ConfigService) {}

  async analizarDocumento(buffer: Buffer): Promise<ResultadoIA> {
    const parsed = await pdfParse(buffer);
    const texto = parsed.text;

    if (!texto || texto.trim().length === 0) {
      throw new HttpException(
        'No se pudo extraer texto del PDF',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.ejecutarAnalisis(
      buildDocumentoPrompt(texto),
      buildDocumentoPromptStrict(texto),
      false,
      null,
    );
  }

  async analizarMockup(buffer: Buffer): Promise<ResultadoIA> {
    const base64 = buffer.toString('base64');

    return this.ejecutarAnalisis(
      buildMockupPrompt(),
      buildMockupPromptStrict(),
      true,
      base64,
    );
  }

  private async ejecutarAnalisis(
    prompt: string,
    promptStrict: string,
    esMockup: boolean,
    imagenBase64: string | null,
  ): Promise<ResultadoIA> {
    try {
      const respuesta = await this.llamarOllama(prompt, imagenBase64, esMockup);
      return this.parsearRespuesta(respuesta, esMockup);
    } catch (firstError) {
      if (this.esErrorConexion(firstError)) {
        throw new HttpException(
          'Servicio de IA no disponible. Verifica que Ollama esté corriendo en localhost:11434',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      if (this.esErrorTimeout(firstError)) {
        throw new HttpException(
          'El análisis tardó demasiado. El hardware disponible no tiene suficiente capacidad para procesar la imagen en tiempo razonable.',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }

      this.logger.warn('Primer intento fallido, reintentando con prompt estricto');

      try {
        const respuesta = await this.llamarOllama(promptStrict, imagenBase64, esMockup);
        return this.parsearRespuesta(respuesta, esMockup);
      } catch (secondError) {
        if (this.esErrorConexion(secondError)) {
          throw new HttpException(
            'Servicio de IA no disponible. Verifica que Ollama esté corriendo en localhost:11434',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }
        if (this.esErrorTimeout(secondError)) {
          throw new HttpException(
            'El análisis tardó demasiado. Intenta con una imagen de menor resolución.',
            HttpStatus.GATEWAY_TIMEOUT,
          );
        }
        throw new HttpException(
          'No se pudo generar un análisis válido. Intenta con un archivo más detallado.',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
  }

  private async llamarOllama(
    prompt: string,
    imagenBase64: string | null,
    esMockup: boolean,
  ): Promise<string> {
    const ollamaUrl =
      this.configService.get<string>('ollamaUrl') ?? 'http://localhost:11434';

    const modeloTexto =
      this.configService.get<string>('ollamaModel') ?? 'llama3.2';
    const modeloVision =
      this.configService.get<string>('ollamaModelVision') ?? 'llava';
    const model = esMockup ? modeloVision : modeloTexto;

    const body: OllamaRequestBody = {
      model,
      prompt,
      stream: false,
    };

    if (imagenBase64) {
      body.images = [imagenBase64];
    }

    this.logger.log(`Llamando Ollama con modelo ${model}`);

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.TIMEOUT_MS),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      this.logger.error(`Ollama error status ${response.status}: ${errorBody}`);
      throw new Error(`Ollama respondió con status ${response.status}: ${errorBody}`);
    }

    const data = (await response.json()) as OllamaResponse;
    return data.response;
  }

  private parsearRespuesta(respuesta: string, esMockup: boolean): ResultadoIA {
    this.logger.log('Respuesta cruda Ollama: ' + respuesta.substring(0, 500));
    const limpia = this.limpiarJson(respuesta);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(limpia) as Record<string, unknown>;
    } catch {
      throw new Error(`JSON inválido recibido de Ollama: ${limpia.substring(0, 200)}`);
    }

    const mapeado = esMockup ? mapMockupResponse(parsed) : parsed;
    const normalizado = normalizarResultadoIA(mapeado, esMockup);
    this.logger.log('Resultado normalizado: ' + JSON.stringify(normalizado));
    return validateResultadoIA(normalizado, esMockup);
  }

  private limpiarJson(texto: string): string {
    let limpio = texto.trim();
    const jsonBlockMatch = limpio.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonBlockMatch) {
      limpio = jsonBlockMatch[1].trim();
    }
    const start = limpio.indexOf('{');
    const end = limpio.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      limpio = limpio.substring(start, end + 1);
    }
    return limpio;
  }

  private esErrorConexion(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('fetch failed') ||
        error.message.includes('ENOTFOUND')
      );
    }
    return false;
  }

  private esErrorTimeout(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.name === 'TimeoutError' ||
        error.message.includes('TimeoutError') ||
        error.message.includes('AbortError') ||
        error.name === 'AbortError'
      );
    }
    return false;
  }
}