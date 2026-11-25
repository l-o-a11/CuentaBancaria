import { validarPaginacion } from "../validaciones.js";

export default class ObtenerCuentas {
  constructor({ cuentaRepository }) {
    this.cuentaRepository = cuentaRepository;
  }

  async ejecutar(consulta = {}) {
    const { pagina, limite } = validarPaginacion(consulta);
    const incluirCerradas = consulta.incluirCerradas === true || consulta.incluirCerradas === "true";
    const { items, total } = await this.cuentaRepository.listar({ pagina, limite, incluirCerradas });
    return { items, total, pagina, limite };
  }
}
