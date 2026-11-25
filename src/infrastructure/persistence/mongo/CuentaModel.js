import mongoose from "mongoose";
import { EstadoCuenta } from "../../../domain/tiposMovimiento.js";

// El saldo se almacena en CENTAVOS (entero). Ver domain/dinero.js.
const CuentaSchema = new mongoose.Schema(
  {
    nroCuenta: { type: String, required: true, unique: true, match: /^\d{3,20}$/ },
    nombreCliente: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    saldo: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      validate: { validator: Number.isInteger, message: "El saldo debe ser un entero de centavos" },
    },
    estado: { type: String, enum: Object.values(EstadoCuenta), default: EstadoCuenta.ACTIVA },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Cuenta || mongoose.model("Cuenta", CuentaSchema);
