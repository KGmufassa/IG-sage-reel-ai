import { Prisma } from "@prisma/client"

import { DEFAULT_SCENE_OVERLAP_MS } from "@/config/constants"
import { metrics } from "@/core/observability/metrics"
import { logProcessingEvent } from "@/core/observability/processing-log"
import { sceneRepository } from "@/modules/scenes/repository"
import type { MotionBlueprint } from "@/modules/motion/types"

function intensityFromPreset(value: string | null | undefined): MotionBlueprint["intensity"] {
  if (!value) {
    return "medium"
  }

  const normalized = value.toLowerCase()
  if (normalized.includes("low") || normalized.includes("gentle")) {
    return "low"
  }
  if (normalized.includes("high") || normalized.includes("dramatic")) {
    return "high"
  }
  return "medium"
}

function movementFromPreset(value: string | null | undefined): MotionBlueprint["cameraMovement"] {
  if (!value) {
    return "drift-up"
  }

  const normalized = value.toLowerCase()
  if (normalized.includes("push")) {
    return "push-in"
  }
  if (normalized.includes("right") || normalized.includes("pan")) {
    return "drift-right"
  }
  if (normalized.includes("still") || normalized.includes("hold")) {
    return "hold"
  }
  return "drift-up"
}

export const motionService = {
  buildBlueprint(scene: {
    assets: Array<{ assetType: string; layerOrder: number | null }>
    motionPreset?: string | null
    motionIntensity?: string | null
  }): MotionBlueprint {
    const intensity = intensityFromPreset(scene.motionIntensity ?? scene.motionPreset)
    const layerAssets = scene.assets.filter((asset) => asset.assetType === "layer")
    const denominator = Math.max(layerAssets.length, 1)
    const baseMultiplier = intensity === "low" ? 0.55 : intensity === "high" ? 1.25 : 0.85

    return {
      cameraMovement: movementFromPreset(scene.motionPreset),
      intensity,
      layerBehaviors: layerAssets.map((asset, index) => ({
        layerIndex: asset.layerOrder ?? index,
        parallax: Number((((index + 1) / denominator) * baseMultiplier).toFixed(3)),
        scale: Number((1 + (index / denominator) * 0.08 * baseMultiplier).toFixed(3)),
        opacity: Number((1 - index * 0.04).toFixed(3)),
      })),
      transition: {
        overlapMs: DEFAULT_SCENE_OVERLAP_MS,
        easing: intensity === "high" ? "linear" : "ease-out",
      },
      reducedMotion: {
        cameraMovement: "hold",
        multiplier: 0.2,
      },
    }
  },

  async generateForScene(scene: {
    id: string
    projectId: string
    assets: Array<{ assetType: string; layerOrder: number | null }>
    motionPreset?: string | null
    motionIntensity?: string | null
  }, traceId?: string | null) {
    const startedAt = Date.now()
    const blueprint = this.buildBlueprint(scene)

    const updatedScene = await sceneRepository.setMotionBlueprint(scene.id, blueprint as Prisma.InputJsonValue)

    metrics.observe("processing_motion_duration_ms", Date.now() - startedAt)
    logProcessingEvent({
      event: "motion blueprint generated",
      traceId,
      projectId: scene.projectId,
      sceneId: scene.id,
      details: {
        layerCount: blueprint.layerBehaviors.length,
        intensity: blueprint.intensity,
      },
    })

    return updatedScene
  },
}
