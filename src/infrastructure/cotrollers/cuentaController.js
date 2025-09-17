import CreateCuenta from "../../application/use-cases/CreateCuenta.js";
import GetCuenta from "../../application/use-cases/GetCueta.js";
import GetCuentaById from "../../application/use-cases/GetCuentaById.js";
import UpdateCuenta from "../../application/use-cases/UpdateCuenta.js";
import DeleteCuenta from "../../application/use-cases/DeleteCuenta.js";
import CuentaRepositoryMongo from "../repositories/CuentaRepositoryMongo.js";

const repo = new CuentaRepositoryMongo();

export const createCuenta = async (req, res) => {
  try {
    const uc = new CreateCuenta(repo);
    const newCuenta = await uc.execute(req.body);
    res.status(201).json(newCuenta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCuenta = async (req, res) => {
  try {
    const uc = new GetCuenta(repo);
    const cuentas = await uc.execute();
    res.json(cuentas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCuentaById = async (req, res) => {
  try {
    const uc = new GetCuentaById(repo);
    const cuenta = await uc.execute(req.params.id);
    if (!cuenta) return res.status(404).json({ message: "Cuenta no encontrada" });
    res.json(cuenta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCuenta = async (req, res) => {
  try {
    const uc = new UpdateCuenta(repo);
    const updated = await uc.execute(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Cuenta no encontrada" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCuenta = async (req, res) => {
  try {
    const uc = new DeleteCuenta(repo);
    const result = await uc.execute(req.params.id);
    if (!result) return res.status(404).json({ message: "Cuenta no encontrada" });
    res.json({ message: "Cuenta eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
