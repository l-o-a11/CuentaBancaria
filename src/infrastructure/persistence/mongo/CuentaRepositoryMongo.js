import { ErrorConflicto } from "../../../domain/errores.js";
import { EstadoCuenta } from "../../../domain/tiposMovimiento.js";
import CuentaModel from "./CuentaModel.js";

const aEntidad = (doc) =>
  doc && {
    id: doc._id.toString(),
    nroCuenta: doc.nroCuenta,
    nombreCliente: doc.nombreCliente,
    saldo: doc.saldo, // centavos
    estado: doc.estado,
    creadaEn: doc.createdAt,
    actualizadaEn: doc.updatedAt,
  };

const OPCIONES = { returnDocument: "after", runValidators: true, lean: true };

export default class CuentaRepositoryMongo {
  async crear({ nroCuenta, nombreCliente, saldo }) {
    try {
      const doc = await CuentaModel.create({ nroCuenta, nombreCliente, saldo });
      return aEntidad(doc.toObject());
    } catch (err) {
      if (err.code === 11000) throw new ErrorConflicto("Ya existe una cuenta con ese número");
      throw err;
    }
  }

  async listar({ pagina, limite, incluirCerradas = false }) {
    const filtro = incluirCerradas ? {} : { estado: EstadoCuenta.ACTIVA };
    const [docs, total] = await Promise.all([
      CuentaModel.find(filtro)
        .sort({ createdAt: -1, _id: -1 })
        .skip((pagina - 1) * limite)
        .limit(limite)
        .lean(),
      CuentaModel.countDocuments(filtro),
    ]);
    return { items: docs.map(aEntidad), total };
  }

  async obtenerPorId(id) {
    return aEntidad(await CuentaModel.findById(id).lean());
  }

  async actualizarNombre(id, nombreCliente) {
    const doc = await CuentaModel.findOneAndUpdate(
      { _id: id, estado: EstadoCuenta.ACTIVA },
      { nombreCliente },
      OPCIONES
    );
    return aEntidad(doc);
  }

  /** Suma al saldo de forma atómica. Devuelve null si la cuenta no existe o está cerrada. */
  async acreditar(id, centavos) {
    const doc = await CuentaModel.findOneAndUpdate(
      { _id: id, estado: EstadoCuenta.ACTIVA },
      { $inc: { saldo: centavos } },
      OPCIONES
    );
    return aEntidad(doc);
  }

  /** Resta del saldo de forma atómica solo si alcanza. Devuelve null si no se pudo. */
  async debitar(id, centavos) {
    const doc = await CuentaModel.findOneAndUpdate(
      { _id: id, estado: EstadoCuenta.ACTIVA, saldo: { $gte: centavos } },
      { $inc: { saldo: -centavos } },
      OPCIONES
    );
    return aEntidad(doc);
  }

  /** Cierra la cuenta solo si está activa y con saldo 0. */
  async cerrar(id) {
    const doc = await CuentaModel.findOneAndUpdate(
      { _id: id, estado: EstadoCuenta.ACTIVA, saldo: 0 },
      { estado: EstadoCuenta.CERRADA },
      OPCIONES
    );
    return aEntidad(doc);
  }
}
