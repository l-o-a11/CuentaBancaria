export default class UpdateCuenta {

constructor(CuentaRepository) {
this.CuentaRepository = CuentaRepository;
}

async execute(id, CuentaData) {
return await this.CuentaRepository.update(id, CuentaData);
}
}