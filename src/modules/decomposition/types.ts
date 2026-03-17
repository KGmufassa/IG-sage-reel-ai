export type DecompositionRequest = {
  projectId: string
  sceneId: string
  imageUrl: string
  mimeType: string
  width?: number
  height?: number
  targetLayers: number
  correlationId: string
}

export type DecompositionLayer = {
  index: number
  width?: number
  height?: number
  metadata: Record<string, unknown>
}

export type DecompositionResult = {
  providerJobId: string
  modelVersion: string
  width?: number
  height?: number
  layers: DecompositionLayer[]
  warnings?: string[]
}

export type ProviderErrorKind = "retryable" | "terminal"

export class ProviderError extends Error {
  public readonly kind: ProviderErrorKind
  public readonly code: string

  constructor(kind: ProviderErrorKind, code: string, message: string) {
    super(message)
    this.kind = kind
    this.code = code
  }
}
