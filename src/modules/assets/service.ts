import { Prisma } from "@prisma/client"

import { buildCompositeAssetPath, buildLayerAssetPath, buildManifestAssetPath, buildThumbnailAssetPath } from "@/modules/assets/pathing"
import { sceneRepository } from "@/modules/scenes/repository"

type PersistAssetsInput = {
  projectId: string
  sceneId: string
  generationVersion: number
  expiresAt?: Date | null
  width?: number
  height?: number
  layers: Array<{
    index: number
    width?: number
    height?: number
    metadata: Record<string, unknown>
  }>
}

export const assetService = {
  async persistDecompositionAssets(input: PersistAssetsInput) {
    const manifest = {
      projectId: input.projectId,
      sceneId: input.sceneId,
      generationVersion: input.generationVersion,
      layers: input.layers.map((layer) => ({
        index: layer.index,
        path: buildLayerAssetPath(input.projectId, input.sceneId, input.generationVersion, layer.index),
        width: layer.width ?? null,
        height: layer.height ?? null,
        metadata: layer.metadata,
      })),
      compositePath: buildCompositeAssetPath(input.projectId, input.sceneId, input.generationVersion),
      thumbnailPath: buildThumbnailAssetPath(input.projectId, input.sceneId, input.generationVersion),
      generatedAt: new Date().toISOString(),
    }

    return sceneRepository.replaceGeneratedAssets(input.sceneId, {
      expiresAt: input.expiresAt,
      layerAssets: input.layers.map((layer) => ({
        assetUrl: buildLayerAssetPath(input.projectId, input.sceneId, input.generationVersion, layer.index),
        width: layer.width,
        height: layer.height,
        layerOrder: layer.index,
        metadataJson: layer.metadata as Prisma.InputJsonValue,
      })),
      compositeAsset: {
        assetUrl: buildCompositeAssetPath(input.projectId, input.sceneId, input.generationVersion),
        width: input.width,
        height: input.height,
        metadataJson: {
          kind: "composite-preview",
        },
      },
      manifestAsset: {
        assetUrl: buildManifestAssetPath(input.projectId, input.sceneId, input.generationVersion),
        metadataJson: manifest as Prisma.InputJsonValue,
      },
    })
  },
}
