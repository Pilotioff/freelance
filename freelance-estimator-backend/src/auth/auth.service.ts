import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Usuario, UsuarioDocument, RolUsuario } from '../mongo/schemas/usuario.schema';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../common/guards/jwt-auth.guard';

const SALT_ROUNDS = 12;

export interface UsuarioResponse {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  activo?: boolean;
  empresa?: string;
  telefono?: string;
  tarifa_hora_cop?: number;
  avatar_url?: string;
  onboarding_completado: boolean;
  tarifa_hora_sugerida?: number;
  tarifa_preferida?: string;
}

export interface LoginExitoResponse {
  exito: true;
  mensaje: string;
  usuario: UsuarioResponse;
  modoRespaldo: false;
}

export interface LoginResponse {
  usuario: UsuarioResponse;
  modoRespaldo?: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registro(dto: RegistroDto): Promise<LoginResponse> {
    const existente = await this.usuarioModel.findOne({ email: dto.email.toLowerCase() });
    if (existente) {
      throw new ConflictException('El email ya está registrado');
    }

    const hash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const tarifaDefault = this.configService.get<number>('tarifaHoraDefault') ?? 150000;

    const usuario = await this.usuarioModel.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email.toLowerCase(),
      password: hash,
      empresa: dto.empresa,
      telefono: dto.telefono,
      tarifa_hora_cop: dto.tarifa_hora_cop ?? tarifaDefault,
      rol: RolUsuario.USER,
    });

    return { usuario: this.mapUsuario(usuario) };
  }

  async login(dto: LoginDto): Promise<LoginExitoResponse> {
    const usuario = await this.usuarioModel.findOne({
      email: dto.email.toLowerCase().trim(),
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const esValido = await bcrypt.compare(dto.password, usuario.password);
    if (!esValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      exito: true,
      mensaje: 'Sesión iniciada.',
      usuario: this.mapUsuario(usuario),
      modoRespaldo: false,
    };
  }

  async obtenerPorId(id: string): Promise<UsuarioResponse | null> {
    if (id === 'admin-respaldo') {
      return {
        id: 'admin-respaldo',
        nombre: 'Admin',
        apellido: 'Respaldo',
        email: this.configService.get<string>('adminEmailRespaldo') ?? '',
        rol: RolUsuario.ADMIN,
        tarifa_hora_cop: this.configService.get<number>('tarifaHoraDefault') ?? 150000,
        onboarding_completado: true,
      };
    }

    const usuario = await this.usuarioModel.findById(id);
    if (!usuario || !usuario.activo) {
      return null;
    }
    return this.mapUsuario(usuario);
  }

  generarToken(usuario: UsuarioResponse): string {
    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };
    return this.jwtService.sign(payload);
  }

  private mapUsuario(usuario: UsuarioDocument): UsuarioResponse {
    return {
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo ?? true,
      empresa: usuario.empresa,
      telefono: usuario.telefono,
      tarifa_hora_cop: usuario.tarifa_hora_cop,
      avatar_url: usuario.avatar_url,
      onboarding_completado: usuario.onboarding_completado ?? false,
      tarifa_hora_sugerida: usuario.tarifa_hora_sugerida,
      tarifa_preferida: usuario.tarifa_preferida,
    };
  }
}
