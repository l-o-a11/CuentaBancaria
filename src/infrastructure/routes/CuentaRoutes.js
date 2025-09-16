import {Router} from "express"
import{
    createCuenta,
    getCuenta,
    getCuentaById,
    updateCuennta,
    deleteCuenta
} from "../cotrollers/cuentaController.js";

const router = Router();

router.post("/", createCuenta);
router.get("/", getCuenta);
router.get("/:id", getCuentaById);
router.put("/:id", updateCuennta);
router.delete("/:id", deleteCuenta);

export default router;