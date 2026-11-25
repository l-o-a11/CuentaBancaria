import ActualizarCuenta from "./use-cases/ActualizarCuenta.js";
import CerrarCuenta from "./use-cases/CerrarCuenta.js";
import Consignar from "./use-cases/Consignar.js";
import CrearCuenta from "./use-cases/CrearCuenta.js";
import ObtenerCuentaPorId from "./use-cases/ObtenerCuentaPorId.js";
import ObtenerCuentas from "./use-cases/ObtenerCuentas.js";
import ObtenerMovimientos from "./use-cases/ObtenerMovimientos.js";
import Retirar from "./use-cases/Retirar.js";

/** Ensambla los casos de uso con los repositorios que se le inyecten (Mongo, memoria para tests, etc.). */
export function crearCasosDeUso(dependencias) {
  return {
    crearCuenta: new CrearCuenta(dependencias),
    obtenerCuentas: new ObtenerCuentas(dependencias),
    obtenerCuentaPorId: new ObtenerCuentaPorId(dependencias),
    actualizarCuenta: new ActualizarCuenta(dependencias),
    cerrarCuenta: new CerrarCuenta(dependencias),
    consignar: new Consignar(dependencias),
    retirar: new Retirar(dependencias),
    obtenerMovimientos: new ObtenerMovimientos(dependencias),
  };
}
