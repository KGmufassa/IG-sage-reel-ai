import { AppError } from "@/core/errors/app-error"
import { logProcessingEvent } from "@/core/observability/processing-log"
import { triggerDevJobRunner } from "@/infrastructure/jobs/trigger-dev"
import { featureFlagService } from "@/modules/feature-flags"
import { sceneService } from "@/modules/scenes"

export const processingService = {
  async enqueueSceneDecomposition(sceneId: string, correlationId: string, options?: { reason?: string; resetGeneration?: boolean }) {
    if (!featureFlagService.allowsProcessing(sceneId)) {
      throw new AppError({
        code: "PROCESSING_CANARY_DISABLED",
        message: "Scene processing is not enabled for this scene yet.",
        statusCode: 503,
      })
    }

    const scene = await sceneService.getById(sceneId)
    const job = await sceneService.enqueueDecomposition(sceneId, {
      correlationId,
      reason: options?.reason,
      resetGeneration: options?.resetGeneration,
    })

    const latestScene = await sceneService.getById(sceneId)

    if (!latestScene.project) {
      throw new AppError({
        code: "PROJECT_NOT_FOUND",
        message: "Scene project is missing.",
        statusCode: 404,
      })
    }

    logProcessingEvent({
      event: "scene decomposition enqueued",
      traceId: correlationId,
      projectId: latestScene.project.id,
      sceneId: latestScene.id,
      jobId: job.id,
      details: {
        reason: options?.reason ?? null,
        resetGeneration: Boolean(options?.resetGeneration),
      },
    })

    await triggerDevJobRunner.dispatchDecomposition({
      scene: {
        id: latestScene.id,
        generationVersion: latestScene.generationVersion,
        sourceImageUrl: latestScene.sourceImageUrl,
        expiresAt: latestScene.expiresAt,
        project: { id: latestScene.project.id },
        assets: latestScene.assets.map((asset) => ({
          assetType: asset.assetType,
          metadataJson: asset.metadataJson,
        })),
      },
      job: {
        id: job.id,
        attemptCount: job.attemptCount,
        correlationId: job.correlationId,
      },
    })

    return {
      job,
      scene,
    }
  },
}
