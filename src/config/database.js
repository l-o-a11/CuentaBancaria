import mongoose from "mongoose";

export async function conectarDB(uri) {
  await mongoose.connect(uri);
  console.log("Conexión a MongoDB establecida");
}

export async function desconectarDB() {
  await mongoose.disconnect();
}
