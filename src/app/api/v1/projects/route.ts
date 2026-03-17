import { defineRoute } from "@/core/http/route-handler"
import { enforceRateLimit } from "@/infrastructure/rate-limit/memory-rate-limiter"
import { projectController } from "@/interfaces/http/controllers/project-controller"

function requestIdentifier(request: Request & { headers: Headers; nextUrl: URL }) {
  return request.headers.get("x-forwarded-for") ?? "local"
}

export const GET = defineRoute(async (request, context) => {
  enforceRateLimit(`${request.method}:${request.nextUrl.pathname}:${requestIdentifier(request)}`)
  return projectController.list(context)
})

export const POST = defineRoute(async (request, context) => {
  enforceRateLimit(`${request.method}:${request.nextUrl.pathname}:${requestIdentifier(request)}`)
  return projectController.create(request, context)
})
