import { ErrorReglaNegocio } from "../../domain/errores.js";
import { exigirCuentaActiva } from "../errores-operacion.js";

/** Las cuentas no se borran: se cierran, para conservar el historial. Requiere saldo 0. */
export default class CerrarCuenta {
  constructor({ cuentaRepository }) {
    this.cuentaRepository = cuentaRepository;
  }

  async ejecutar(id) {
    const cerrada = await this.cuentaRepository.cerrar(id);
    if (cerrada) return cerrada;

    const cuenta = await exigirCuentaActiva(this.cuentaRepository, id);
    if (cuenta.saldo > 0) {
      throw new ErrorReglaNegocio(
        "No se puede cerrar una cuenta con saldo. Retire los fondos primero",
        "SALDO_PENDIENTE"
      );
    }
    throw new ErrorReglaNegocio("No fue posible cerrar la cuenta, intente de nuevo", "CIERRE_FALLIDO");
  }
}
