import { defineRoute } from "@/core/http/route-handler"
import { healthController } from "@/interfaces/http/controllers/health-controller"

export const GET = defineRoute(async (_request, context) => healthController.live(context))
