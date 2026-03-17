import { getEnv } from "@/config/env"

export const featureFlagService = {
  flags() {
    const env = getEnv()

    return {
      motionPipeline: env.FEATURE_MOTION_PIPELINE,
      playbackPipeline: env.FEATURE_PLAYBACK_PIPELINE,
      previewFallbacks: env.FEATURE_PREVIEW_FALLBACKS,
      reducedMotionPreview: env.FEATURE_REDUCED_MOTION_PREVIEW,
      processingCanaryPercent: env.PROCESSING_CANARY_PERCENT,
    }
  },

  isEnabled(flag: "motionPipeline" | "playbackPipeline" | "previewFallbacks" | "reducedMotionPreview") {
    return this.flags()[flag]
  },

  allowsProcessing(seed: string) {
    const percent = this.flags().processingCanaryPercent

    if (percent >= 100) {
      return true
    }

    let hash = 0
    for (let index = 0; index < seed.length; index += 1) {
      hash = (hash * 31 + seed.charCodeAt(index)) % 100
    }

    return hash < percent
  },
}
