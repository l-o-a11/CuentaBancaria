import { ErrorDominio } from "../../../domain/errores.js";

export function rutaNoEncontrada(req, res) {
  res.status(404).json({
    error: { codigo: "RUTA_NO_ENCONTRADA", mensaje: `No existe la ruta ${req.method} ${req.originalUrl}` },
  });
}

// Express exige la firma de 4 parámetros para reconocer un middleware de errores.
// eslint-disable-next-line no-unused-vars
export function manejadorErrores(err, req, res, _next) {
  if (err instanceof ErrorDominio) {
    return res.status(err.estado).json({
      error: { codigo: err.codigo, mensaje: err.message, detalles: err.detalles },
    });
  }

  // Errores de body-parser: JSON mal formado o cuerpo demasiado grande.
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: { codigo: "JSON_INVALIDO", mensaje: "El cuerpo de la petición no es un JSON válido" } });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: { codigo: "CUERPO_MUY_GRANDE", mensaje: "El cuerpo de la petición es demasiado grande" } });
  }

  // Error inesperado: se registra completo en el servidor, pero al cliente no se le filtran detalles internos.
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err);
  res.status(500).json({ error: { codigo: "ERROR_INTERNO", mensaje: "Ocurrió un error inesperado" } });
}
