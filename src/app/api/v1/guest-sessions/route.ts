import { defineRoute } from "@/core/http/route-handler"
import { enforceRateLimit } from "@/infrastructure/rate-limit/memory-rate-limiter"
import { guestSessionController } from "@/interfaces/http/controllers/guest-session-controller"

export const POST = defineRoute(async (request, context) => {
  const requestId = request.headers.get("x-forwarded-for") ?? "local"
  enforceRateLimit(`${request.method}:${request.nextUrl.pathname}:${requestId}`)
  return guestSessionController.create(context)
})
