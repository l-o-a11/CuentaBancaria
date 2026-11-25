import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

import { crearCuentaController } from "../infrastructure/http/controllers/cuentaController.js";
import { manejadorErrores, rutaNoEncontrada } from "../infrastructure/http/middlewares/manejadorErrores.js";
import { crearRutasCuenta } from "../infrastructure/http/routes/cuentaRoutes.js";

/**
 * Construye la aplicación Express a partir de los casos de uso.
 * No sabe nada de Mongo ni del puerto: así se puede probar sin base de datos.
 */
export function crearServidor({ casosDeUso, corsOrigen = ["*"], limitarSolicitudes = true }) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: corsOrigen.includes("*") ? "*" : corsOrigen }));
  app.use(express.json({ limit: "10kb" }));

  if (limitarSolicitudes) {
    app.use(rateLimit({ windowMs: 60_000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false }));
  }

  app.get("/salud", (_req, res) => res.json({ estado: "ok" }));
  app.use("/api/cuentas", crearRutasCuenta(crearCuentaController(casosDeUso)));

  app.use(rutaNoEncontrada);
  app.use(manejadorErrores);
  return app;
}
