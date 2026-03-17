export type UpdateSceneInput = {
  contextText?: string | null
  motionPreset?: string | null
  motionIntensity?: string | null
}

export type FinalizeUploadSceneInput = {
  uploadToken: string
  originalFilename: string
  mimeType: string
  sizeBytes: number
  width?: number
  height?: number
  contextText?: string | null
  motionPreset?: string | null
  motionIntensity?: string | null
}
