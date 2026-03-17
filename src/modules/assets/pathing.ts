import { UPLOAD_BASE_PATH } from "@/config/constants"

export function buildSceneVersionPath(projectId: string, sceneId: string, generationVersion: number) {
  return `${UPLOAD_BASE_PATH}/${projectId}/scenes/${sceneId}/v${generationVersion}`
}

export function buildOriginalAssetPath(projectId: string, filename: string) {
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase()
  return `${UPLOAD_BASE_PATH}/${projectId}/incoming/${Date.now()}-${safeFilename}`
}

export function buildThumbnailAssetPath(projectId: string, sceneId: string, generationVersion: number) {
  return `${buildSceneVersionPath(projectId, sceneId, generationVersion)}/thumbnail.webp`
}

export function buildLayerAssetPath(projectId: string, sceneId: string, generationVersion: number, index: number) {
  return `${buildSceneVersionPath(projectId, sceneId, generationVersion)}/layers/${index}.png`
}

export function buildCompositeAssetPath(projectId: string, sceneId: string, generationVersion: number) {
  return `${buildSceneVersionPath(projectId, sceneId, generationVersion)}/composite.png`
}

export function buildManifestAssetPath(projectId: string, sceneId: string, generationVersion: number) {
  return `${buildSceneVersionPath(projectId, sceneId, generationVersion)}/manifest.json`
}
