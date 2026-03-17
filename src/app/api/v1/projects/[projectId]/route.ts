import { defineRoute } from "@/core/http/route-handler"
import { enforceRateLimit } from "@/infrastructure/rate-limit/memory-rate-limiter"
import { projectController } from "@/interfaces/http/controllers/project-controller"

export const GET = defineRoute(async (request, context) => {
  enforceRateLimit(`${request.method}:${request.nextUrl.pathname}:${request.headers.get("x-forwarded-for") ?? "local"}`)
  const projectId = request.nextUrl.pathname.split("/").at(-1) ?? ""
  return projectController.getById(projectId, context)
})

export const PATCH = defineRoute(async (request, context) => {
  enforceRateLimit(`${request.method}:${request.nextUrl.pathname}:${request.headers.get("x-forwarded-for") ?? "local"}`)
  const projectId = request.nextUrl.pathname.split("/").at(-1) ?? ""
  return projectController.update(projectId, request, context)
})

export const DELETE = defineRoute(async (request, context) => {
  enforceRateLimit(`${request.method}:${request.nextUrl.pathname}:${request.headers.get("x-forwarded-for") ?? "local"}`)
  const projectId = request.nextUrl.pathname.split("/").at(-1) ?? ""
  return projectController.remove(projectId, context)
})
