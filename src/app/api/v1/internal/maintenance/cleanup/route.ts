import { defineRoute } from "@/core/http/route-handler"
import { maintenanceController } from "@/interfaces/http/controllers/maintenance-controller"

export const POST = defineRoute(async (_request, context) => maintenanceController.cleanup(context))
