import { z } from "zod"

export const updateSceneInputSchema = z.object({
  contextText: z.string().trim().max(4000).nullable().optional(),
  motionPreset: z.string().trim().max(120).nullable().optional(),
  motionIntensity: z.string().trim().max(120).nullable().optional(),
})

export const finalizeUploadsInputSchema = z.object({
  uploads: z.array(
    z.object({
      uploadToken: z.string().min(1),
      originalFilename: z.string().trim().min(1).max(255),
      mimeType: z.string().trim().min(1),
      sizeBytes: z.number().int().positive(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      contextText: z.string().trim().max(4000).nullish(),
      motionPreset: z.string().trim().max(120).nullish(),
      motionIntensity: z.string().trim().max(120).nullish(),
    }),
  ).min(1),
})

export const sceneReprocessInputSchema = z.object({
  reason: z.string().trim().max(255).optional(),
})
