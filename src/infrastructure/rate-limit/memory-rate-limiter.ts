import { AppError } from "@/core/errors/app-error"
import { getEnv } from "@/config/env"

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export function enforceRateLimit(identifier: string) {
  const env = getEnv()
  const now = Date.now()
  const current = buckets.get(identifier)

  if (!current || current.resetAt <= now) {
    buckets.set(identifier, {
      count: 1,
      resetAt: now + env.RATE_LIMIT_WINDOW_MS,
    })
    return
  }

  current.count += 1
  buckets.set(identifier, current)

  if (current.count > env.RATE_LIMIT_MAX_REQUESTS) {
    throw new AppError({
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please try again later.",
      statusCode: 429,
      details: {
        resetAt: current.resetAt,
      },
    })
  }
}
