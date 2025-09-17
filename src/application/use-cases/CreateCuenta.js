export default class CreateCuenta {
    constructor(cuentaRepository) {
        this.cuentaRepository = cuentaRepository;
    }

    async execute(cuentaData) {
        if (!cuentaData.nroCuenta) throw new Error("El número de cuenta es requerido");
        if (!cuentaData.nombreCliente) throw new Error("El nombre del cliente es requerido");
        if (cuentaData.saldo === undefined || cuentaData.saldo === null) {
            throw new Error("El saldo de la cuenta es requerido");
        }

        const toSave = {
            nroCuenta: cuentaData.nroCuenta,
            nombreCliente: cuentaData.nombreCliente,
            saldo: cuentaData.saldo
        };

        return await this.cuentaRepository.create(toSave);
    }
}

// "nroCuenta": "001",
//     "nombreCliente": "Juan Pérez",
//     "saldo": 1200
// http://localhost:3000/api/cuentas

