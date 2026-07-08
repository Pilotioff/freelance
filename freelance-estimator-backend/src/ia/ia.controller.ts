import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IaService } from './ia.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ResultadoIA } from './dto/resultado-ia.dto';

const MIME_IMAGENES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

@ApiTags('IA')
@Controller('ia')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('token')
export class IaController {
  constructor(private readonly iaService: IaService) {}

  @Post('analizar-documento')
  @UseInterceptors(FileInterceptor('documento'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { documento: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Analizar documento PDF con IA' })
  @ApiResponse({ status: 200, description: 'Parámetros detectados' })
  @ApiResponse({ status: 422, description: 'No se pudo analizar' })
  async analizarDocumento(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResultadoIA> {
    if (!file) {
      throw new BadRequestException('Se requiere un archivo PDF');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Solo se aceptan archivos PDF');
    }
    return this.iaService.analizarDocumento(file.buffer);
  }

  @Post('analizar-mockup')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { imagen: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Analizar mockup/imagen con IA' })
  @ApiResponse({ status: 200, description: 'Parámetros detectados' })
  @ApiResponse({ status: 422, description: 'No se pudo analizar' })
  async analizarMockup(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResultadoIA> {
    if (!file) {
      throw new BadRequestException('Se requiere una imagen');
    }
    if (!MIME_IMAGENES.includes(file.mimetype)) {
      throw new BadRequestException('Solo se aceptan PNG, JPG o WEBP');
    }
    return this.iaService.analizarMockup(file.buffer);
  }
}
