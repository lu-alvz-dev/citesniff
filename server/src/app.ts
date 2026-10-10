import express from "express";
import evidenceRouter from "./routes/evidence.js";
import healthRouter from "./routes/health.js";

const app = express();

app.use(express.json());
app.use(healthRouter);
app.use(evidenceRouter);

export default app;
