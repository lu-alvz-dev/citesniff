import { z } from "zod";

export const sourceUrlSchema = z
  .object({
    url: z
      .url({
        protocol: /^https?$/,
      })
      .refine((value) => {
        const parsedUrl = new URL(value);

        return parsedUrl.username === "" && parsedUrl.password === "";
      }, "URL must not contain credentials"),
  })
  .strict();

export type SourceUrlInput = z.infer<typeof sourceUrlSchema>;
