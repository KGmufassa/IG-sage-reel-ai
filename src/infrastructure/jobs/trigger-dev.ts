import { metrics } from "@/core/observability/metrics"
import { logProcessingEvent } from "@/core/observability/processing-log"
import { ProviderError } from "@/modules/decomposition/types"
import { decompositionService } from "@/modules/decomposition/service"
import { sceneService } from "@/modules/scenes"

type TriggerJobPayload = {
  scene: {
    id: string
    generationVersion: number
    sourceImageUrl: string | null
    expiresAt: Date | null
    project: { id: string }
    assets: Array<{ assetType: string; metadataJson: unknown }>
  }
  job: {
    id: string
    attemptCount: number
    correlationId?: string | null
  }
}

export const triggerDevJobRunner = {
  async dispatchDecomposition(payload: TriggerJobPayload) {
    queueMicrotask(async () => {
      try {
        metrics.gauge("processing_queue_depth", 1)
        await decompositionService.processScene(payload.scene, payload.job)
        metrics.gauge("processing_queue_depth", 0)
      } catch (error) {
        metrics.increment("processing_failures_total")
        if (error instanceof ProviderError && error.kind === "retryable" && payload.job.attemptCount < 2) {
          metrics.increment("processing_retries_total")
          await sceneService.markFailed(payload.job.id, payload.scene.id, `${error.code}: ${error.message}`, payload.job.attemptCount + 1)
          const retryJob = await sceneService.enqueueDecomposition(payload.scene.id, {
            correlationId: payload.job.correlationId ?? crypto.randomUUID(),
            reason: "automatic-retry",
          })
          logProcessingEvent({
            event: "scene decomposition retry scheduled",
            traceId: payload.job.correlationId,
            projectId: payload.scene.project.id,
            sceneId: payload.scene.id,
            jobId: retryJob.id,
          })
          await this.dispatchDecomposition({
            scene: { ...payload.scene },
            job: {
              id: retryJob.id,
              attemptCount: retryJob.attemptCount,
              correlationId: retryJob.correlationId,
            },
          })
          return
        }

        const message = error instanceof Error ? error.message : "Scene decomposition failed."
        await sceneService.markFailed(payload.job.id, payload.scene.id, message, payload.job.attemptCount + 1)
        metrics.gauge("processing_queue_depth", 0)
      }
    })
  },
}
