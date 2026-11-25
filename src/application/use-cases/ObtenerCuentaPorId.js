import { ErrorNoEncontrado } from "../../domain/errores.js";

export default class ObtenerCuentaPorId {
  constructor({ cuentaRepository }) {
    this.cuentaRepository = cuentaRepository;
  }

  async ejecutar(id) {
    const cuenta = await this.cuentaRepository.obtenerPorId(id);
    if (!cuenta) throw new ErrorNoEncontrado("Cuenta no encontrada");
    return cuenta;
  }
}
