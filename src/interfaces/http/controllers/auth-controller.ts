import { cookies } from "next/headers"

import { auth } from "@/auth"
import { AppError } from "@/core/errors/app-error"
import { ok, created } from "@/lib/api-response"
import { authService } from "@/modules/auth"
import { registerInputSchema } from "@/modules/auth/validator"
import { guestSessionService } from "@/modules/guest-sessions"
import { getEnv } from "@/config/env"
import type { RequestContext } from "@/core/request/context"

export const authController = {
  async session(context: RequestContext) {
    const env = getEnv()
    const session = await auth()
    const cookieStore = await cookies()
    const guestSessionId = cookieStore.get(env.GUEST_SESSION_COOKIE_NAME)?.value
    const guestSession = await guestSessionService.resolve(guestSessionId).catch(() => null)

    if (session?.user?.id) {
      return ok(
        {
          actor: {
            kind: "authenticated",
            userId: session.user.id,
            email: session.user.email,
            guestSessionId: guestSession?.id ?? null,
          },
        },
        { correlationId: context.correlationId },
      )
    }

    if (guestSession) {
      return ok(
        {
          actor: {
            kind: "guest",
            guestSessionId: guestSession.id,
            expiresAt: guestSession.expiresAt,
          },
        },
        { correlationId: context.correlationId },
      )
    }

    return ok(
      {
        actor: {
          kind: "anonymous",
        },
      },
      { correlationId: context.correlationId },
    )
  },

  async register(request: Request, context: RequestContext) {
    const body = await request.json().catch(() => {
      throw new AppError({
        code: "INVALID_JSON",
        message: "Request body must be valid JSON.",
        statusCode: 400,
      })
    })

    const input = registerInputSchema.parse(body)
    const user = await authService.register(input)

    return created(user, { correlationId: context.correlationId })
  },
}
