import express from "express";
import evidenceRouter from "./routes/evidence.js";
import healthRouter from "./routes/health.js";
import sourcesRouter from "./routes/sources.js";

const app = express();

app.use(express.json());
app.use(healthRouter);
app.use(evidenceRouter);
app.use(sourcesRouter);

export default app;
