import { defineRoute } from "@/core/http/route-handler"
import { authController } from "@/interfaces/http/controllers/auth-controller"

export const GET = defineRoute(async (_request, context) => authController.session(context))
