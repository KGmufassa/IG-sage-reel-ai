import { createHmac, timingSafeEqual } from "node:crypto"

import { getEnv } from "@/config/env"
import { AppError } from "@/core/errors/app-error"
import { UPLOAD_BASE_PATH } from "@/config/constants"
import type { UploadCandidate, UploadContract } from "@/modules/uploads/types"

type UploadTokenPayload = {
  projectId: string
  filename: string
  mimeType: string
  sizeBytes: number
  storageKey: string
  expiresAt: string
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url")
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(payload: string) {
  const env = getEnv()
  return createHmac("sha256", env.INTERNAL_UPLOAD_TOKEN_SECRET).update(payload).digest("base64url")
}

export const uploadService = {
  validateFiles(files: UploadCandidate[]) {
    const env = getEnv()

    if (files.length > env.UPLOAD_MAX_FILES) {
      throw new AppError({
        code: "UPLOAD_LIMIT_EXCEEDED",
        message: `A maximum of ${env.UPLOAD_MAX_FILES} files may be uploaded at once.`,
        statusCode: 400,
      })
    }

    for (const file of files) {
      if (!env.UPLOAD_ALLOWED_MIME_TYPES.includes(file.mimeType)) {
        throw new AppError({
          code: "UNSUPPORTED_FILE_TYPE",
          message: `${file.filename} uses an unsupported file type.`,
          statusCode: 400,
        })
      }

      if (file.sizeBytes > env.UPLOAD_MAX_FILE_SIZE_BYTES) {
        throw new AppError({
          code: "FILE_TOO_LARGE",
          message: `${file.filename} exceeds the upload size limit.`,
          statusCode: 400,
        })
      }
    }
  },

  createUploadContracts(projectId: string, files: UploadCandidate[]): UploadContract[] {
    this.validateFiles(files)

    return files.map((file, index) => {
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
      const safeFilename = file.filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase()
      const storageKey = `${UPLOAD_BASE_PATH}/${projectId}/incoming/${Date.now()}-${index}-${safeFilename}`

      const payload: UploadTokenPayload = {
        projectId,
        filename: file.filename,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        storageKey,
        expiresAt: expiresAt.toISOString(),
      }

      const serializedPayload = JSON.stringify(payload)
      const encodedPayload = toBase64Url(serializedPayload)
      const signature = sign(encodedPayload)

      return {
        uploadToken: `${encodedPayload}.${signature}`,
        uploadUrl: `/api/v1/uploads/${encodedPayload}.${signature}`,
        storageKey,
        expiresAt: payload.expiresAt,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
      }
    })
  },

  verifyUploadToken(uploadToken: string) {
    const [encodedPayload, providedSignature] = uploadToken.split(".")

    if (!encodedPayload || !providedSignature) {
      throw new AppError({
        code: "INVALID_UPLOAD_TOKEN",
        message: "Upload token is malformed.",
        statusCode: 400,
      })
    }

    const expectedSignature = sign(encodedPayload)

    if (providedSignature.length !== expectedSignature.length) {
      throw new AppError({
        code: "INVALID_UPLOAD_TOKEN",
        message: "Upload token signature is invalid.",
        statusCode: 400,
      })
    }

    if (!timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature))) {
      throw new AppError({
        code: "INVALID_UPLOAD_TOKEN",
        message: "Upload token signature is invalid.",
        statusCode: 400,
      })
    }

    const payload = JSON.parse(fromBase64Url(encodedPayload)) as UploadTokenPayload

    if (new Date(payload.expiresAt).getTime() <= Date.now()) {
      throw new AppError({
        code: "UPLOAD_TOKEN_EXPIRED",
        message: "Upload token has expired.",
        statusCode: 410,
      })
    }

    return payload
  },
}
