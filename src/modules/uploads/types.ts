export type UploadCandidate = {
  filename: string
  mimeType: string
  sizeBytes: number
}

export type UploadContract = {
  uploadToken: string
  uploadUrl: string
  storageKey: string
  expiresAt: string
  mimeType: string
  sizeBytes: number
}

export type FinalizedUpload = {
  projectId: string
  storageKey: string
  filename: string
  mimeType: string
  sizeBytes: number
  expiresAt?: string | null
}
