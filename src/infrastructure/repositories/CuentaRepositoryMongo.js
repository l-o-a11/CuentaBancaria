import mongoose from "mongoose";

const CuentaSchema = new mongoose.Schema({
    nroCuenta: {type: Number, required : true },
    nombreCliente: {type: String, required: true},
    saldo: { type: Number, required: true}
}, {timestamps: true});

const CuentaModel = mongoose.model("Cuenta", CuentaSchema);

class CuentaRepositoryMongo{
    async create(cuentaData){
        const c = new CuentaModel(cuentaData);
        return await c.save();
    }
    async findAll(){
        return await CuentaModel.find().sort({ createdAt: -1});
    }
    async findById(id){
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return await CuentaModel.findById(id);
    }
    async update(id, cuentaData){
        if(!mongoose.Types.ObjectId.isValid(id)) return null;
        return await CuentaModel.findByIdAndUpdate(id, cuentaDat, {new:true});
    }
     async delete(id){
        if(!mongoose.Types.ObjectId.isValid(id)) return null;
        return await CuentaModel.findByIdAndDelete(id);
    }
}

export default CuentaRepositoryMongo;