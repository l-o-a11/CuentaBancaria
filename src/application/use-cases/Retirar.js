import { aCentavos } from "../../domain/dinero.js";
import { ErrorSaldoInsuficiente } from "../../domain/errores.js";
import { TipoMovimiento } from "../../domain/tiposMovimiento.js";
import { exigirCuentaActiva } from "../errores-operacion.js";
import { validarDescripcion } from "../validaciones.js";

export default class Retirar {
  constructor({ cuentaRepository, movimientoRepository }) {
    this.cuentaRepository = cuentaRepository;
    this.movimientoRepository = movimientoRepository;
  }

  async ejecutar(id, datos = {}) {
    const monto = aCentavos(datos.monto, { campo: "monto" });
    const descripcion = validarDescripcion(datos.descripcion);

    // La condición "saldo >= monto" se evalúa dentro de la misma operación atómica
    // que descuenta, así que dos retiros simultáneos no pueden dejar la cuenta en negativo.
    const cuenta = await this.cuentaRepository.debitar(id, monto);
    if (!cuenta) {
      await exigirCuentaActiva(this.cuentaRepository, id);
      throw new ErrorSaldoInsuficiente();
    }

    const movimiento = await this.movimientoRepository.registrar({
      cuentaId: cuenta.id,
      tipo: TipoMovimiento.RETIRO,
      monto,
      saldoResultante: cuenta.saldo,
      descripcion,
    });
    return { cuenta, movimiento };
  }
}
