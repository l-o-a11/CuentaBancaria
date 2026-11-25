import mongoose from "mongoose";
import { TipoMovimiento } from "../../../domain/tiposMovimiento.js";

// Libro de movimientos: solo se agregan registros, nunca se modifican ni se borran.
const MovimientoSchema = new mongoose.Schema(
  {
    cuentaId: { type: mongoose.Schema.Types.ObjectId, ref: "Cuenta", required: true, index: true },
    tipo: { type: String, enum: Object.values(TipoMovimiento), required: true },
    monto: { type: Number, required: true, min: 1 },
    saldoResultante: { type: Number, required: true, min: 0 },
    descripcion: { type: String, maxlength: 140 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

export default mongoose.models.Movimiento || mongoose.model("Movimiento", MovimientoSchema);
