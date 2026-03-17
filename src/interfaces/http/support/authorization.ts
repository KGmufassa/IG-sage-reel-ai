import { AppError } from "@/core/errors/app-error"
import { authorizeProjectAction } from "@/modules/authorization"
import type { AuthorizationAction, AuthorizationActor, AuthorizationProject } from "@/modules/authorization"

export function ensureProjectAccess(
  actor: AuthorizationActor,
  action: AuthorizationAction,
  project: AuthorizationProject,
) {
  const decision = authorizeProjectAction(actor, action, project)

  if (!decision.allowed) {
    throw new AppError({
      code: "FORBIDDEN",
      message: decision.reason ?? "Access denied.",
      statusCode: action === "preview" ? 403 : 403,
    })
  }
}
