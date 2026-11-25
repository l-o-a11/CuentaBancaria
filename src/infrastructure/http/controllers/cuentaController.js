import { presentarCuenta, presentarMovimiento, presentarPagina } from "../presentadores.js";

/**
 * Express 5 propaga automáticamente los errores de los handlers async al
 * middleware de errores, por eso aquí no hace falta try/catch.
 */
export function crearCuentaController(casosDeUso) {
  return {
    crear: async (req, res) => {
      const cuenta = await casosDeUso.crearCuenta.ejecutar(req.body ?? {});
      res.status(201).json(presentarCuenta(cuenta));
    },

    listar: async (req, res) => {
      const resultado = await casosDeUso.obtenerCuentas.ejecutar(req.query);
      res.json(presentarPagina(resultado, presentarCuenta));
    },

    obtener: async (req, res) => {
      const cuenta = await casosDeUso.obtenerCuentaPorId.ejecutar(req.params.id);
      res.json(presentarCuenta(cuenta));
    },

    actualizar: async (req, res) => {
      const cuenta = await casosDeUso.actualizarCuenta.ejecutar(req.params.id, req.body ?? {});
      res.json(presentarCuenta(cuenta));
    },

    cerrar: async (req, res) => {
      const cuenta = await casosDeUso.cerrarCuenta.ejecutar(req.params.id);
      res.json({ mensaje: "Cuenta cerrada correctamente", cuenta: presentarCuenta(cuenta) });
    },

    consignar: async (req, res) => {
      const { cuenta, movimiento } = await casosDeUso.consignar.ejecutar(req.params.id, req.body ?? {});
      res.status(201).json({
        mensaje: "Consignación exitosa",
        cuenta: presentarCuenta(cuenta),
        movimiento: presentarMovimiento(movimiento),
      });
    },

    retirar: async (req, res) => {
      const { cuenta, movimiento } = await casosDeUso.retirar.ejecutar(req.params.id, req.body ?? {});
      res.status(201).json({
        mensaje: "Retiro exitoso",
        cuenta: presentarCuenta(cuenta),
        movimiento: presentarMovimiento(movimiento),
      });
    },

    movimientos: async (req, res) => {
      const resultado = await casosDeUso.obtenerMovimientos.ejecutar(req.params.id, req.query);
      res.json(presentarPagina(resultado, presentarMovimiento));
    },
  };
}
