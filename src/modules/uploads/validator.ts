import { z } from "zod"

export const initiateUploadsInputSchema = z.object({
  files: z.array(
    z.object({
      filename: z.string().trim().min(1).max(255),
      mimeType: z.string().trim().min(1),
      sizeBytes: z.number().int().positive(),
    }),
  ).min(1),
})
