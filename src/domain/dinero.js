import { ErrorValidacion } from "./errores.js";

/**
 * El dinero se guarda como número ENTERO de centavos. Los decimales de
 * punto flotante acumulan errores (0.1 + 0.2 !== 0.3), inaceptable en finanzas.
 * La API recibe y devuelve pesos; solo el interior trabaja en centavos.
 */
export const MONTO_MAXIMO = 1_000_000_000_000; // por operación

export function aCentavos(valor, { campo = "monto", permitirCero = false } = {}) {
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    throw new ErrorValidacion(`El campo "${campo}" debe ser un número`);
  }

  const centavos = Math.round(valor * 100);
  if (Math.abs(valor * 100 - centavos) > 1e-6) {
    throw new ErrorValidacion(`El campo "${campo}" admite máximo 2 decimales`);
  }
  if (centavos < 0 || (centavos === 0 && !permitirCero)) {
    throw new ErrorValidacion(
      permitirCero
        ? `El campo "${campo}" no puede ser negativo`
        : `El campo "${campo}" debe ser mayor a 0`
    );
  }
  if (valor > MONTO_MAXIMO) {
    throw new ErrorValidacion(`El campo "${campo}" supera el máximo permitido por operación`);
  }
  return centavos;
}

export const aPesos = (centavos) => centavos / 100;
