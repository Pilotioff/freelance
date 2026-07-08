import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI no está definida en .env');
  }

  await mongoose.connect(uri);
  const resultado = await mongoose.connection.collection('usuarios').updateMany(
    { onboarding_completado: { $exists: false } },
    { $set: { onboarding_completado: true } },
  );

  console.log(`Backfill completado: ${resultado.modifiedCount} usuarios marcados como onboarding_completado=true`);
  await mongoose.disconnect();
}

main().catch((e: Error) => {
  console.error('Error en backfill:', e.message);
  process.exit(1);
});
