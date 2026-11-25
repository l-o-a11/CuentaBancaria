import { ErrorValidacion } from "../../../domain/errores.js";

const OBJECT_ID = /^[a-f\d]{24}$/i;

/** Rechaza ids mal formados antes de llegar a la base de datos (evita CastError → 500). */
export function validarId(req, _res, next, id) {
  if (!OBJECT_ID.test(id)) return next(new ErrorValidacion("El id de la cuenta no es válido"));
  next();
}
