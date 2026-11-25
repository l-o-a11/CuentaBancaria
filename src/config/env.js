export function cargarConfig(env = process.env) {
  const mongoUri = env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI no está definido en el archivo .env");

  return {
    puerto: Number(env.PORT) || 3000,
    mongoUri,
    corsOrigen: (env.CORS_ORIGEN ?? "*").split(",").map((o) => o.trim()),
  };
}
