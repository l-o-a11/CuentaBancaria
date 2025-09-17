import mongoose from "mongoose";


const CuentaSchema = new mongoose.Schema({
  nroCuenta: { type: Number, required: true },
  nombreCliente: { type: String, required: true },
  saldo: { type: Number, required: true },
  modificaciones: { type: Number, default: 0 } 
}, { timestamps: true });

const CuentaModel = mongoose.model("Cuenta", CuentaSchema);

export default class CuentaRepositoryMongo {
  async create(cuentaData) {
    const c = new CuentaModel(cuentaData);
    return await c.save();
  }

  async getAll() {
    return await CuentaModel.find();
  }

  async getById(id) {
    return await CuentaModel.findById(id);
  }

  async update(id, data) {
 
    return await CuentaModel.findByIdAndUpdate(
      id,
      { ...data, $inc: { modificaciones: 1 } },
      { new: true }
    );
  }

  async delete(id) {
    return await CuentaModel.findByIdAndDelete(id);
  }
}
