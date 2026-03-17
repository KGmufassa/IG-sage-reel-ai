import { cookies } from "next/headers"

import { auth } from "@/auth"
import { getEnv } from "@/config/env"
import { guestSessionService } from "@/modules/guest-sessions"
import type { AuthorizationActor } from "@/modules/authorization"

export async function resolveRequestActor(): Promise<AuthorizationActor> {
  const session = await auth()
  const env = getEnv()
  const cookieStore = await cookies()
  const guestSessionId = cookieStore.get(env.GUEST_SESSION_COOKIE_NAME)?.value
  const guestSession = await guestSessionService.resolve(guestSessionId).catch(() => null)

  if (session?.user?.id) {
    return {
      kind: "authenticated",
      userId: session.user.id,
      guestSessionId: guestSession?.id ?? null,
    }
  }

  if (guestSession) {
    return {
      kind: "guest",
      guestSessionId: guestSession.id,
      expiresAt: guestSession.expiresAt,
    }
  }

  return {
    kind: "anonymous",
  }
}
