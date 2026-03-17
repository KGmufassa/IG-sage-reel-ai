import { describe, expect, it } from "vitest"

import { motionService } from "@/modules/motion"

describe("motionService", () => {
  it("builds deterministic layer behaviors from scene assets", () => {
    const blueprint = motionService.buildBlueprint({
      motionPreset: "push dramatic",
      motionIntensity: "high",
      assets: [
        { assetType: "layer", layerOrder: 0 },
        { assetType: "layer", layerOrder: 1 },
        { assetType: "layer", layerOrder: 2 },
      ],
    })

    expect(blueprint.cameraMovement).toBe("push-in")
    expect(blueprint.intensity).toBe("high")
    expect(blueprint.layerBehaviors).toHaveLength(3)
    expect(blueprint.transition.overlapMs).toBeGreaterThan(0)
  })
})
