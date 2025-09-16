export default class CreateCuenta{
    constructor(CuentaRepository){
        this.CuentaRepository = CuentaRepository;
    }

   async execute(cuentaData){
    if(!CuentaData.nroCuenta) throw new Error("El numero de cuenta es requerido")
    if(!CuentaData.nombreCliente) throw new Error("El nombre del cliente es requerido")
    if(!CuentaData.saldo) throw new Error("El saldo de la cuenta es requerido")
    

   const toSave = {
    nroCuenta: cuentaData.nroCuenta,
    nombreCliente: cuentaData.nombreCliente,
    saldo: cuentaData.saldo

   };
   return await this.CuentaRepository.create(toSave);
}
}