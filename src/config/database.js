import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error ("MONGO_URI no definido en .env");
        
        await mongoose.connect(uri);
        console.log("coneccion a Mongo realizada");
    } catch(err){
        console.error("Error de conexion;", err.message);
        process.exit(1)
    }
};
export default connectDB;