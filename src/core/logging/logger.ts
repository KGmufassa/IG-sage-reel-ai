import pino from "pino"

import { getEnv } from "@/config/env"

let loggerInstance: pino.Logger | null = null

export function getLogger() {
  if (loggerInstance) {
    return loggerInstance
  }

  const env = getEnv()

  loggerInstance = pino({
    level: env.LOG_LEVEL,
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
  })

  return loggerInstance
}
