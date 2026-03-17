import { z } from "zod"

export const createProjectInputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  globalContext: z.string().trim().max(4000).nullish(),
  stylePreset: z.string().trim().max(120).nullish(),
})

export const updateProjectInputSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  globalContext: z.string().trim().max(4000).nullable().optional(),
  stylePreset: z.string().trim().max(120).nullable().optional(),
})

export const reorderScenesInputSchema = z.object({
  sceneIds: z.array(z.string().uuid()).min(1),
})

export const claimProjectInputSchema = z.object({
  guestSessionId: z.string().uuid().optional(),
})
