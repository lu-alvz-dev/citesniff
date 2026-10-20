import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("POST /api/sources/pdf", () => {
  it("extracts text and page numbers from a valid PDF", async () => {
    const pdf = await readFile("tests/fixtures/sample.pdf");

    const response = await request(app)
      .post("/api/sources/pdf")
      .attach("file", pdf, {
        filename: "sample.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(200);
    expect(response.body.pageCount).toBeGreaterThan(0);
    expect(response.body.pages).toHaveLength(response.body.pageCount);
    expect(response.body.pages[0]).toHaveProperty("pageNumber", 1);
    expect(response.body.pages[0]).toHaveProperty("text");
  });

  it("returns 400 when no file is provided", async () => {
    const response = await request(app).post("/api/sources/pdf");

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("PDF file is required");
  });

  it("rejects a file without a PDF signature", async () => {
    const response = await request(app)
      .post("/api/sources/pdf")
      .attach("file", Buffer.from("This is not a PDF"), {
        filename: "invalid.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("PDF signature");
  });

  it("rejects a PDF larger than 10 MB", async () => {
    const oversizedFile = Buffer.alloc(10 * 1024 * 1024 + 1, 0x20);
    oversizedFile.write("%PDF-");

    const response = await request(app)
      .post("/api/sources/pdf")
      .attach("file", oversizedFile, {
        filename: "oversized.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(413);
    expect(response.body.error).toContain("10 MB");
  });
});
