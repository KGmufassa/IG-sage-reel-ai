import { getEnv } from "@/config/env"
import { ProviderError } from "@/modules/decomposition/types"

type SubmitPayload = {
  imageUrl: string
  mimeType: string
  targetLayers: number
  correlationId: string
}

export const qwenClient = {
  async submit(payload: SubmitPayload) {
    const env = getEnv()

    if (env.QWEN_MOCK_MODE || !env.QWEN_API_URL || !env.QWEN_API_KEY) {
      return {
        id: `mock-${crypto.randomUUID()}`,
        modelVersion: env.QWEN_MODEL,
        width: 1080,
        height: 1920,
        layers: Array.from({ length: payload.targetLayers }, (_, index) => ({
          index,
          width: 1080,
          height: 1920,
          depth: index,
        })),
      }
    }

    let attempt = 0
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), env.QWEN_TIMEOUT_MS)

    try {
      while (attempt <= env.QWEN_MAX_RETRIES) {
        try {
          const response = await fetch(`${env.QWEN_API_URL}/decompositions`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${env.QWEN_API_KEY}`,
              "x-correlation-id": payload.correlationId,
            },
            body: JSON.stringify({
              imageUrl: payload.imageUrl,
              mimeType: payload.mimeType,
              targetLayers: payload.targetLayers,
              model: env.QWEN_MODEL,
            }),
            signal: controller.signal,
          })

          if (response.status >= 500 || response.status === 429) {
            throw new ProviderError("retryable", "QWEN_UNAVAILABLE", "Qwen provider is temporarily unavailable.")
          }

          if (!response.ok) {
            const text = await response.text()
            throw new ProviderError("terminal", "QWEN_REQUEST_REJECTED", text || "Qwen rejected the request.")
          }

          return response.json()
        } catch (error) {
          const isLastAttempt = attempt >= env.QWEN_MAX_RETRIES

          if (error instanceof ProviderError) {
            if (error.kind === "terminal" || isLastAttempt) {
              throw error
            }
          } else if (isLastAttempt) {
            throw new ProviderError("retryable", "QWEN_NETWORK_ERROR", "Qwen request failed due to a network error.")
          }

          attempt += 1
          await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)))
        }
      }

      throw new ProviderError("retryable", "QWEN_UNKNOWN_FAILURE", "Qwen request failed after retries.")
    } finally {
      clearTimeout(timeout)
    }
  },
}
