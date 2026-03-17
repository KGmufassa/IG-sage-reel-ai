import { AppError } from "@/core/errors/app-error"
import { getEnv } from "@/config/env"
import { guestSessionRepository } from "@/modules/guest-sessions/repository"

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

export const guestSessionService = {
  async issue() {
    const env = getEnv()
    const expiresAt = addHours(new Date(), env.GUEST_SESSION_TTL_HOURS)
    return guestSessionRepository.create({ expiresAt })
  },

  async resolve(guestSessionId: string | undefined) {
    if (!guestSessionId) {
      return null
    }

    const guestSession = await guestSessionRepository.findById(guestSessionId)

    if (!guestSession) {
      return null
    }

    if (guestSession.expiresAt.getTime() <= Date.now()) {
      throw new AppError({
        code: "GUEST_SESSION_EXPIRED",
        message: "Guest session has expired.",
        statusCode: 401,
      })
    }

    await guestSessionRepository.touch(guestSession.id)
    return guestSession
  },
}
