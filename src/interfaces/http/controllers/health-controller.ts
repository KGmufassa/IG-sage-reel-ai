import { prisma } from "@/infrastructure/db/prisma"
import { envIsConfigured } from "@/config/env"
import { metrics } from "@/core/observability/metrics"
import { ok } from "@/lib/api-response"
import { featureFlagService } from "@/modules/feature-flags"
import type { RequestContext } from "@/core/request/context"

export const healthController = {
  async live(context: RequestContext) {
    return ok(
        {
          status: "ok",
          metrics: metrics.snapshot(),
          featureFlags: featureFlagService.flags(),
        },
        { correlationId: context.correlationId },
      )
  },

  async ready(context: RequestContext) {
    if (!envIsConfigured()) {
      return ok(
        {
          status: "degraded",
          checks: {
            env: false,
            database: false,
          },
        },
        { correlationId: context.correlationId },
        { status: 503 },
      )
    }

    try {
      await prisma.$queryRaw`SELECT 1`
      return ok(
        {
          status: "ok",
          checks: {
            env: true,
            database: true,
          },
        },
        { correlationId: context.correlationId },
      )
    } catch {
      return ok(
        {
          status: "degraded",
          checks: {
            env: true,
            database: false,
          },
          metrics: metrics.snapshot(),
          featureFlags: featureFlagService.flags(),
        },
        { correlationId: context.correlationId },
        { status: 503 },
      )
    }
  },
}
