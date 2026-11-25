import { ErrorNoEncontrado, ErrorReglaNegocio } from "../domain/errores.js";
import { EstadoCuenta } from "../domain/tiposMovimiento.js";

/**
 * Las operaciones sobre el saldo son atómicas en el repositorio: devuelven
 * null cuando no se cumplieron las condiciones. Esta función averigua por qué.
 * Devuelve la cuenta (si existe y está activa) o lanza el error correspondiente.
 */
export async function exigirCuentaActiva(cuentaRepository, id) {
  const cuenta = await cuentaRepository.obtenerPorId(id);
  if (!cuenta) throw new ErrorNoEncontrado("Cuenta no encontrada");
  if (cuenta.estado === EstadoCuenta.CERRADA) {
    throw new ErrorReglaNegocio("La cuenta está cerrada", "CUENTA_CERRADA");
  }
  return cuenta;
}
