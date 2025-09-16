import express from "express";
import cors from "cort";

import CuentaRoutes from "../infrastructure/routes/CuentaRoutes.js";

const app = express();

app.use(cors());
