import { ErrorNoEncontrado } from "../../domain/errores.js";
import { validarPaginacion } from "../validaciones.js";

export default class ObtenerMovimientos {
  constructor({ cuentaRepository, movimientoRepository }) {
    this.cuentaRepository = cuentaRepository;
    this.movimientoRepository = movimientoRepository;
  }

  async ejecutar(id, consulta = {}) {
    const { pagina, limite } = validarPaginacion(consulta);
    const cuenta = await this.cuentaRepository.obtenerPorId(id);
    if (!cuenta) throw new ErrorNoEncontrado("Cuenta no encontrada");

    const { items, total } = await this.movimientoRepository.listarPorCuenta(id, { pagina, limite });
    return { items, total, pagina, limite };
  }
}
