import { defineRoute } from "@/core/http/route-handler"
import { enforceRateLimit } from "@/infrastructure/rate-limit/memory-rate-limiter"
import { authController } from "@/interfaces/http/controllers/auth-controller"

export const POST = defineRoute(async (request, context) => {
  const requestId = request.headers.get("x-forwarded-for") ?? "local"
  enforceRateLimit(`${request.method}:${request.nextUrl.pathname}:${requestId}`)
  return authController.register(request, context)
})
