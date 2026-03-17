import { ok } from "@/lib/api-response"
import { maintenanceService } from "@/modules/maintenance"
import type { RequestContext } from "@/core/request/context"

export const maintenanceController = {
  async cleanup(context: RequestContext) {
    const result = await maintenanceService.cleanupExpiredGuestResources(context.correlationId)
    return ok(result, { correlationId: context.correlationId })
  },

  async recoverTimeouts(context: RequestContext) {
    const result = await maintenanceService.recoverTimedOutJobs(context.correlationId)
    return ok(result, { correlationId: context.correlationId })
  },
}
