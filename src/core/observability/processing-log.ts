import { getLogger } from "@/core/logging/logger"

type ProcessingLogInput = {
  event: string
  traceId?: string | null
  projectId?: string | null
  sceneId?: string | null
  jobId?: string | null
  details?: Record<string, unknown>
}

export function logProcessingEvent(input: ProcessingLogInput) {
  const logger = getLogger()

  logger.info(
    {
      traceId: input.traceId ?? null,
      projectId: input.projectId ?? null,
      sceneId: input.sceneId ?? null,
      jobId: input.jobId ?? null,
      ...(input.details ?? {}),
    },
    input.event,
  )
}
