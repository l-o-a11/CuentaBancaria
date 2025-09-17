import mongoose from "mongoose";

const CuentaSchema = new mongoose.Schema({
  nroCuenta: { type: Number, required: true },
  nombreCliente: { type: String, required: true },
  saldo: { type: Number, required: true },
  modificaciones: { type: Number, default: 0 } 
}, { timestamps: true });

const CuentaModel = mongoose.model("Cuenta", CuentaSchema);

export default CuentaModel;
