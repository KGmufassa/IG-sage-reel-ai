import { defineRoute } from "@/core/http/route-handler"
import { enforceRateLimit } from "@/infrastructure/rate-limit/memory-rate-limiter"
import { projectController } from "@/interfaces/http/controllers/project-controller"

export const POST = defineRoute(async (request, context) => {
  enforceRateLimit(`${request.method}:${request.nextUrl.pathname}:${request.headers.get("x-forwarded-for") ?? "local"}`)
  const segments = request.nextUrl.pathname.split("/")
  const projectId = segments.at(-3) ?? ""
  return projectController.reorderScenes(projectId, request, context)
})
