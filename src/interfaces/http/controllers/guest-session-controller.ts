import { cookies } from "next/headers"

import { getEnv } from "@/config/env"
import { COOKIE_MAX_AGE_SECONDS } from "@/core/security/cookies"
import { created } from "@/lib/api-response"
import { guestSessionService } from "@/modules/guest-sessions"
import type { RequestContext } from "@/core/request/context"

export const guestSessionController = {
  async create(context: RequestContext) {
    const env = getEnv()
    const session = await guestSessionService.issue()
    const cookieStore = await cookies()

    cookieStore.set(env.GUEST_SESSION_COOKIE_NAME, session.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
      expires: session.expiresAt,
    })

    return created(
      {
        id: session.id,
        expiresAt: session.expiresAt,
      },
      { correlationId: context.correlationId },
    )
  },
}
