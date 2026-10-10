import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
describe("POST /api/evidence/verify", () => {
  it("verifies a quote found in the source", async () => {
    const sourceText =
      "Reliable evidence must be verified against the original source.";

    const response = await request(app).post("/api/evidence/verify").send({
      sourceText,
      quote: sourceText,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ verified: true });
  });

  it("rejects a quote that does not exist in the source", async () => {
    const response = await request(app).post("/api/evidence/verify").send({
      sourceText:
        "Reliable evidence must be verified against the original source.",
      quote: "This quotation does not appear in the source text.",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ verified: false });
  });

  it("rejects a quote that is too short", async () => {
    const response = await request(app).post("/api/evidence/verify").send({
      sourceText: "Evidence must come from the original source.",
      quote: "Evidence must come",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ verified: false });
  });

  it("returns 400 when the quote is empty", async () => {
    const response = await request(app).post("/api/evidence/verify").send({
      sourceText:
        "Reliable evidence must be verified against the original source.",
      quote: "   ",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid request body");
  });
});
