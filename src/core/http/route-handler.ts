import { NextRequest, NextResponse } from "next/server"

import { toErrorResponse } from "@/core/errors/error-response"
import { getLogger } from "@/core/logging/logger"
import { buildRequestContext } from "@/core/request/context"

type RouteCallback = (request: NextRequest, context: Awaited<ReturnType<typeof buildRequestContext>>) => Promise<NextResponse>

export function defineRoute(handler: RouteCallback) {
  return async function route(request: NextRequest) {
    const context = await buildRequestContext(request.nextUrl.pathname, request.method)
    const logger = getLogger()
    const startedAt = Date.now()

    try {
      const response = await handler(request, context)
      response.headers.set("x-correlation-id", context.correlationId)

      logger.info({
        correlationId: context.correlationId,
        method: request.method,
        path: request.nextUrl.pathname,
        statusCode: response.status,
        durationMs: Date.now() - startedAt,
      }, "request completed")

      return response
    } catch (error) {
      logger.error({
        correlationId: context.correlationId,
        method: request.method,
        path: request.nextUrl.pathname,
        durationMs: Date.now() - startedAt,
        err: error,
      }, "request failed")

      const response = toErrorResponse(error, context)
      response.headers.set("x-correlation-id", context.correlationId)
      return response
    }
  }
}
