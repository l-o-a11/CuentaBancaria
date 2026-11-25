import { ErrorValidacion } from "../domain/errores.js";

export function validarNroCuenta(valor) {
  const nro = typeof valor === "number" ? String(valor) : valor;
  if (typeof nro !== "string" || !/^\d{3,20}$/.test(nro.trim())) {
    throw new ErrorValidacion('El campo "nroCuenta" debe contener entre 3 y 20 dígitos');
  }
  return nro.trim();
}

export function validarNombre(valor) {
  if (typeof valor !== "string") {
    throw new ErrorValidacion('El campo "nombreCliente" es requerido');
  }
  const nombre = valor.trim().replace(/\s+/g, " ");
  if (nombre.length < 2 || nombre.length > 100) {
    throw new ErrorValidacion('El campo "nombreCliente" debe tener entre 2 y 100 caracteres');
  }
  return nombre;
}

export function validarDescripcion(valor) {
  if (valor === undefined || valor === null || valor === "") return undefined;
  if (typeof valor !== "string" || valor.trim().length > 140) {
    throw new ErrorValidacion('El campo "descripcion" debe ser texto de máximo 140 caracteres');
  }
  return valor.trim();
}

export function validarPaginacion({ pagina = 1, limite = 20 } = {}) {
  const p = Number(pagina);
  const l = Number(limite);
  if (!Number.isInteger(p) || p < 1) throw new ErrorValidacion('"pagina" debe ser un entero mayor o igual a 1');
  if (!Number.isInteger(l) || l < 1 || l > 100) throw new ErrorValidacion('"limite" debe ser un entero entre 1 y 100');
  return { pagina: p, limite: l };
}
