/**
 * Errores de dominio. Cada uno lleva el código HTTP y un código estable
 * que el cliente puede usar para reaccionar sin depender del texto del mensaje.
 */
export class ErrorDominio extends Error {
  constructor(mensaje, { codigo = "ERROR_DOMINIO", estado = 400, detalles } = {}) {
    super(mensaje);
    this.name = this.constructor.name;
    this.codigo = codigo;
    this.estado = estado;
    this.detalles = detalles;
  }
}

export class ErrorValidacion extends ErrorDominio {
  constructor(mensaje, detalles) {
    super(mensaje, { codigo: "VALIDACION", estado: 400, detalles });
  }
}

export class ErrorNoEncontrado extends ErrorDominio {
  constructor(mensaje = "Recurso no encontrado") {
    super(mensaje, { codigo: "NO_ENCONTRADO", estado: 404 });
  }
}

export class ErrorConflicto extends ErrorDominio {
  constructor(mensaje) {
    super(mensaje, { codigo: "CONFLICTO", estado: 409 });
  }
}

/** Una regla de negocio impide la operación aunque la petición sea válida. */
export class ErrorReglaNegocio extends ErrorDominio {
  constructor(mensaje, codigo = "REGLA_NEGOCIO") {
    super(mensaje, { codigo, estado: 422 });
  }
}

export class ErrorSaldoInsuficiente extends ErrorReglaNegocio {
  constructor() {
    super("Saldo insuficiente para realizar el retiro", "SALDO_INSUFICIENTE");
  }
}
