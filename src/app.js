import "dotenv/config";
import mongoose from "mongoose";

import { crearCasosDeUso } from "./application/casosDeUso.js";
import { conectarDB, desconectarDB } from "./config/database.js";
import { cargarConfig } from "./config/env.js";
import CuentaRepositoryMongo from "./infrastructure/persistence/mongo/CuentaRepositoryMongo.js";
import MovimientoRepositoryMongo from "./infrastructure/persistence/mongo/MovimientoRepositoryMongo.js";
import { crearServidor } from "./interfaces/server.js";

// Punto de entrada: aquí (y solo aquí) se conectan las piezas concretas.
async function iniciar() {
  const config = cargarConfig();
  await conectarDB(config.mongoUri);
  // Garantiza los índices (p. ej. nroCuenta único) antes de aceptar tráfico.
  await Promise.all(Object.values(mongoose.models).map((modelo) => modelo.init()));

  const casosDeUso = crearCasosDeUso({
    cuentaRepository: new CuentaRepositoryMongo(),
    movimientoRepository: new MovimientoRepositoryMongo(),
  });
  const app = crearServidor({ casosDeUso, corsOrigen: config.corsOrigen });

  const servidor = app.listen(config.puerto, () =>
    console.log(`Servidor corriendo en http://localhost:${config.puerto}`)
  );

  const apagar = (senal) => {
    console.log(`${senal} recibido, cerrando...`);
    servidor.close(async () => {
      await desconectarDB();
      process.exit(0);
    });
  };
  process.on("SIGINT", () => apagar("SIGINT"));
  process.on("SIGTERM", () => apagar("SIGTERM"));
}

iniciar().catch((err) => {
  console.error("No se pudo iniciar la aplicación:", err.message);
  process.exit(1);
});
