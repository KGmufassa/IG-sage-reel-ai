import { defineRoute } from "@/core/http/route-handler"
import { enforceRateLimit } from "@/infrastructure/rate-limit/memory-rate-limiter"
import { sceneController } from "@/interfaces/http/controllers/scene-controller"

export const POST = defineRoute(async (request, context) => {
  enforceRateLimit(`${request.method}:${request.nextUrl.pathname}:${request.headers.get("x-forwarded-for") ?? "local"}`)
  const sceneId = request.nextUrl.pathname.split("/").at(-2) ?? ""
  return sceneController.retry(sceneId, request, context)
})
