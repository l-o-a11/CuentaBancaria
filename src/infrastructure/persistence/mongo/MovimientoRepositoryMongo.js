import MovimientoModel from "./MovimientoModel.js";

const aEntidad = (doc) =>
  doc && {
    id: doc._id.toString(),
    cuentaId: doc.cuentaId.toString(),
    tipo: doc.tipo,
    monto: doc.monto, // centavos
    saldoResultante: doc.saldoResultante, // centavos
    descripcion: doc.descripcion,
    fecha: doc.createdAt,
  };

export default class MovimientoRepositoryMongo {
  async registrar({ cuentaId, tipo, monto, saldoResultante, descripcion }) {
    const doc = await MovimientoModel.create({ cuentaId, tipo, monto, saldoResultante, descripcion });
    return aEntidad(doc.toObject());
  }

  async listarPorCuenta(cuentaId, { pagina, limite }) {
    const [docs, total] = await Promise.all([
      MovimientoModel.find({ cuentaId })
        .sort({ createdAt: -1, _id: -1 })
        .skip((pagina - 1) * limite)
        .limit(limite)
        .lean(),
      MovimientoModel.countDocuments({ cuentaId }),
    ]);
    return { items: docs.map(aEntidad), total };
  }
}
