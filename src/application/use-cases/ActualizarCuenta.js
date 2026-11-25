import { ErrorValidacion } from "../../domain/errores.js";
import { exigirCuentaActiva } from "../errores-operacion.js";
import { validarNombre } from "../validaciones.js";

const CAMPOS_PROTEGIDOS = ["saldo", "nroCuenta", "estado"];

export default class ActualizarCuenta {
  constructor({ cuentaRepository }) {
    this.cuentaRepository = cuentaRepository;
  }

  /** Solo se puede modificar el nombre del titular. El saldo cambia únicamente con consignar/retirar. */
  async ejecutar(id, datos = {}) {
    const prohibidos = CAMPOS_PROTEGIDOS.filter((campo) => campo in datos);
    if (prohibidos.length > 0) {
      throw new ErrorValidacion(
        `No se pueden modificar directamente los campos: ${prohibidos.join(", ")}`
      );
    }

    const nombreCliente = validarNombre(datos.nombreCliente);
    const actualizada = await this.cuentaRepository.actualizarNombre(id, nombreCliente);
    if (actualizada) return actualizada;

    return exigirCuentaActiva(this.cuentaRepository, id);
  }
}
