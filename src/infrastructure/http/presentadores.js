import { aPesos } from "../../domain/dinero.js";

/** Convierte las entidades internas (centavos) al formato público de la API (pesos). */
export const presentarCuenta = (c) => ({
  id: c.id,
  nroCuenta: c.nroCuenta,
  nombreCliente: c.nombreCliente,
  saldo: aPesos(c.saldo),
  estado: c.estado,
  creadaEn: c.creadaEn,
  actualizadaEn: c.actualizadaEn,
});

export const presentarMovimiento = (m) => ({
  id: m.id,
  cuentaId: m.cuentaId,
  tipo: m.tipo,
  monto: aPesos(m.monto),
  saldoResultante: aPesos(m.saldoResultante),
  descripcion: m.descripcion,
  fecha: m.fecha,
});

export const presentarPagina = ({ items, total, pagina, limite }, presentar) => ({
  datos: items.map(presentar),
  paginacion: { pagina, limite, total, totalPaginas: Math.max(1, Math.ceil(total / limite)) },
});
