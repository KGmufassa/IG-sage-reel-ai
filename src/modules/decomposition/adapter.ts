import { DEFAULT_SCENE_LAYER_COUNT } from "@/config/constants"
import { qwenClient } from "@/infrastructure/providers/qwen/client"
import type { DecompositionRequest, DecompositionResult } from "@/modules/decomposition/types"
import { ProviderError } from "@/modules/decomposition/types"

export const decompositionAdapter = {
  async decompose(request: DecompositionRequest): Promise<DecompositionResult> {
    const raw = await qwenClient.submit({
      imageUrl: request.imageUrl,
      mimeType: request.mimeType,
      targetLayers: request.targetLayers,
      correlationId: request.correlationId,
    })

    if (!raw || !Array.isArray(raw.layers)) {
      throw new ProviderError("terminal", "QWEN_INVALID_RESPONSE", "Qwen returned an invalid decomposition payload.")
    }

    return {
      providerJobId: String(raw.id ?? `qwen-${request.sceneId}`),
      modelVersion: String(raw.modelVersion ?? "qwen-image-layered"),
      width: typeof raw.width === "number" ? raw.width : request.width,
      height: typeof raw.height === "number" ? raw.height : request.height,
      layers: raw.layers.slice(0, request.targetLayers || DEFAULT_SCENE_LAYER_COUNT).map((layer: any, index: number) => ({
        index,
        width: typeof layer.width === "number" ? layer.width : request.width,
        height: typeof layer.height === "number" ? layer.height : request.height,
        metadata: {
          source: "qwen",
          depth: layer.depth ?? index,
        },
      })),
      warnings: Array.isArray(raw.warnings) ? raw.warnings.map(String) : [],
    }
  },
}
