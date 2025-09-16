import express from "express";
import cors from "cort";

import CuentaRoutes from "../infrastructure/routes/CuentaRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("api/cuenta",CuentaRoutes);

app.get("/", (req, res)=> res.send("API Cuenta Bancaria - OK"));

export default app;