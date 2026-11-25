import { aCentavos } from "../../domain/dinero.js";
import { ErrorReglaNegocio } from "../../domain/errores.js";
import { TipoMovimiento } from "../../domain/tiposMovimiento.js";
import { exigirCuentaActiva } from "../errores-operacion.js";
import { validarDescripcion } from "../validaciones.js";

export default class Consignar {
  constructor({ cuentaRepository, movimientoRepository }) {
    this.cuentaRepository = cuentaRepository;
    this.movimientoRepository = movimientoRepository;
  }

  async ejecutar(id, datos = {}) {
    const monto = aCentavos(datos.monto, { campo: "monto" });
    const descripcion = validarDescripcion(datos.descripcion);

    // Incremento atómico en la base de datos: nunca "leer, sumar y guardar",
    // porque dos consignaciones simultáneas se pisarían entre sí.
    const cuenta = await this.cuentaRepository.acreditar(id, monto);
    if (!cuenta) {
      await exigirCuentaActiva(this.cuentaRepository, id);
      throw new ErrorReglaNegocio("No fue posible registrar la consignación, intente de nuevo", "OPERACION_FALLIDA");
    }

    const movimiento = await this.movimientoRepository.registrar({
      cuentaId: cuenta.id,
      tipo: TipoMovimiento.CONSIGNACION,
      monto,
      saldoResultante: cuenta.saldo,
      descripcion,
    });
    return { cuenta, movimiento };
  }
}
