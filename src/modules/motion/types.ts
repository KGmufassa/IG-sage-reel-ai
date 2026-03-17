export type MotionLayerBehavior = {
  layerIndex: number
  parallax: number
  scale: number
  opacity: number
}

export type MotionBlueprint = {
  cameraMovement: "drift-up" | "push-in" | "drift-right" | "hold"
  intensity: "low" | "medium" | "high"
  layerBehaviors: MotionLayerBehavior[]
  transition: {
    overlapMs: number
    easing: "ease-out" | "linear"
  }
  reducedMotion: {
    cameraMovement: "hold"
    multiplier: number
  }
}
