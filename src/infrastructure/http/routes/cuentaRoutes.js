import { Router } from "express";
import { validarId } from "../middlewares/validarId.js";

export function crearRutasCuenta(controller) {
  const router = Router();
  router.param("id", validarId);

  router.post("/", controller.crear);
  router.get("/", controller.listar);
  router.get("/:id", controller.obtener);
  router.put("/:id", controller.actualizar);
  router.delete("/:id", controller.cerrar);

  router.post("/:id/consignar", controller.consignar);
  router.post("/:id/retirar", controller.retirar);
  router.get("/:id/movimientos", controller.movimientos);

  return router;
}
