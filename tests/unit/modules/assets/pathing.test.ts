import { describe, expect, it } from "vitest"

import { buildLayerAssetPath, buildManifestAssetPath, buildSceneVersionPath, buildThumbnailAssetPath } from "@/modules/assets"

describe("asset pathing", () => {
  it("builds deterministic versioned paths", () => {
    expect(buildSceneVersionPath("project-1", "scene-1", 2)).toBe("projects/project-1/scenes/scene-1/v2")
    expect(buildThumbnailAssetPath("project-1", "scene-1", 2)).toBe("projects/project-1/scenes/scene-1/v2/thumbnail.webp")
    expect(buildLayerAssetPath("project-1", "scene-1", 2, 3)).toBe("projects/project-1/scenes/scene-1/v2/layers/3.png")
    expect(buildManifestAssetPath("project-1", "scene-1", 2)).toBe("projects/project-1/scenes/scene-1/v2/manifest.json")
  })
})
