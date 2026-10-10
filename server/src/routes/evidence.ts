import { Router } from "express";
import { z } from "zod";
import { verifyQuote } from "../domain/analysis/verifyQuote.js";

const evidenceRouter = Router();

const verifyEvidenceSchema = z.object({
  sourceText: z.string().refine((value) => value.trim().length > 0, {
    message: "sourceText must not be empty",
  }),
  quote: z.string().refine((value) => value.trim().length > 0, {
    message: "quote must not be empty",
  }),
});

evidenceRouter.post("/api/evidence/verify", (req, res) => {
  const result = verifyEvidenceSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid request body",
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const { sourceText, quote } = result.data;
  const verified = verifyQuote(sourceText, quote);

  return res.status(200).json({ verified });
});

export default evidenceRouter;
