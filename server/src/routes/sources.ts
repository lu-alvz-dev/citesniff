import { Router } from "express";
import multer from "multer";
import { extractPdfText } from "../services/sourceProcessing/extractPdfText.js";

const sourcesRouter = Router();

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

function receivePdf(
  req: Parameters<Parameters<typeof sourcesRouter.post>[1]>[0],
  res: Parameters<Parameters<typeof sourcesRouter.post>[1]>[1],
  next: Parameters<Parameters<typeof sourcesRouter.post>[1]>[2],
) {
  upload.single("file")(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          error: "PDF file exceeds the 10 MB size limit",
        });
      }

      return res.status(400).json({
        error: "Invalid file upload",
      });
    }

    if (error) {
      return res.status(400).json({
        error: "Could not receive uploaded file",
      });
    }

    next();
  });
}

sourcesRouter.post("/api/sources/pdf", receivePdf, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'A PDF file is required in the "file" field',
    });
  }

  const signature = req.file.buffer.subarray(0, 5).toString("ascii");

  if (signature !== "%PDF-") {
    return res.status(400).json({
      error: "Uploaded file does not have a valid PDF signature",
    });
  }

  try {
    const pages = await extractPdfText(
      new Uint8Array(
        req.file.buffer.buffer,
        req.file.buffer.byteOffset,
        req.file.buffer.byteLength,
      ),
    );

    return res.status(200).json({
      pageCount: pages.length,
      pages,
    });
  } catch {
    return res.status(422).json({
      error: "Could not extract text from the uploaded PDF",
    });
  }
});

export default sourcesRouter;
