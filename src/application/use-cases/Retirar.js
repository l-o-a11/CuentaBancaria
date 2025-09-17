import express from "express";
const router = express.Router();

router.put("/cuentas/:id/retirar", async (req, res) => {
    try {
        const { id } = req.params;
        const { monto } = req.body;

        if (!monto || monto <= 0) {
            return res.status(400).json({ error: "El monto debe ser mayor a 0" });
        }

        const cuenta = await CuentaRepository.findById(id);
        if (!cuenta) {
            return res.status(404).json({ error: "Cuenta no encontrada" });
        }

        if (cuenta.saldo < monto) {
            return res.status(400).json({ error: "Saldo insuficiente" });
        }

        cuenta.saldo -= monto;
        const updated = await CuentaRepository.update(id, cuenta);

        res.json({ message: "Retiro exitoso", cuenta: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
