import { readFileSync } from 'fs';
import { resolve } from 'path';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;
const ADMIN_EMAIL = 'admin@sistema.co';
const ADMIN_PASSWORD = 'admin_respaldo_123';

function loadEnv(): void {
  try {
    const envPath = resolve(__dirname, '../.env');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env opcional si las variables ya están en el entorno
  }
}

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    activo: { type: Boolean, default: true },
    tarifa_hora_cop: Number,
  },
  {
    collection: 'usuarios',
    timestamps: { createdAt: 'creado_en', updatedAt: 'actualizado_en' },
  },
);

async function main(): Promise<void> {
  loadEnv();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI no está definida en .env');
  }

  await mongoose.connect(uri);
  const Usuario = mongoose.model('UsuarioSeed', usuarioSchema);

  const existente = await Usuario.findOne({ email: ADMIN_EMAIL });
  if (existente) {
    console.log(`Usuario admin ya existe: ${ADMIN_EMAIL}`);
  } else {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    const tarifaDefault = parseInt(process.env.TARIFA_HORA_DEFAULT ?? '150000', 10);

    await Usuario.create({
      nombre: 'Administrador',
      apellido: 'Sistema',
      email: ADMIN_EMAIL,
      password: hash,
      rol: 'ADMIN',
      activo: true,
      tarifa_hora_cop: tarifaDefault,
    });

    console.log(`Usuario admin creado: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
}

main().catch((error: Error) => {
  console.error('Error en seed MongoDB:', error.message);
  process.exit(1);
});
