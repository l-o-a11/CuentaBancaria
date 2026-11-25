import { aCentavos } from "../../domain/dinero.js";
import { TipoMovimiento } from "../../domain/tiposMovimiento.js";
import { validarNroCuenta, validarNombre } from "../validaciones.js";

export default class CrearCuenta {
  constructor({ cuentaRepository, movimientoRepository }) {
    this.cuentaRepository = cuentaRepository;
    this.movimientoRepository = movimientoRepository;
  }

  async ejecutar(datos = {}) {
    const nroCuenta = validarNroCuenta(datos.nroCuenta);
    const nombreCliente = validarNombre(datos.nombreCliente);
    const saldo = aCentavos(datos.saldo ?? 0, { campo: "saldo", permitirCero: true });

    const cuenta = await this.cuentaRepository.crear({ nroCuenta, nombreCliente, saldo });

    // El historial debe poder explicar el saldo: el depósito inicial es un movimiento.
    if (saldo > 0) {
      await this.movimientoRepository.registrar({
        cuentaId: cuenta.id,
        tipo: TipoMovimiento.APERTURA,
        monto: saldo,
        saldoResultante: saldo,
        descripcion: "Saldo inicial",
      });
    }
    return cuenta;
  }
}
