import { defineRoute } from "@/core/http/route-handler"
import { enforceRateLimit } from "@/infrastructure/rate-limit/memory-rate-limiter"
import { previewController } from "@/interfaces/http/controllers/preview-controller"

export const GET = defineRoute(async (request, context) => {
  enforceRateLimit(`${request.method}:${request.nextUrl.pathname}:${request.headers.get("x-forwarded-for") ?? "local"}`)
  const segments = request.nextUrl.pathname.split("/")
  const projectId = segments.at(-3) ?? ""
  return previewController.status(projectId, context)
})
