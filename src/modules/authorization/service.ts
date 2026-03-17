import type {
  AuthorizationAction,
  AuthorizationActor,
  AuthorizationDecision,
  AuthorizationProject,
} from "@/modules/authorization/types"

export function authorizeProjectAction(
  actor: AuthorizationActor,
  action: AuthorizationAction,
  project: AuthorizationProject,
): AuthorizationDecision {
  if (actor.kind === "anonymous") {
    return {
      allowed: false,
      reason: "Authentication or guest session is required.",
    }
  }

  if (project.expiresAt && project.expiresAt.getTime() <= Date.now()) {
    return {
      allowed: false,
      reason: "Project access has expired.",
    }
  }

  if (actor.kind === "guest") {
    const matchesGuest = project.guestSessionId === actor.guestSessionId

    if (!matchesGuest) {
      return {
        allowed: false,
        reason: "Guest session does not own this project.",
      }
    }

    if (action === "preview" || action === "edit") {
      return { allowed: true }
    }

    return {
      allowed: false,
      reason: "Guests may preview only until the project is claimed.",
    }
  }

  if (project.ownerId && project.ownerId === actor.userId) {
    return { allowed: true }
  }

  if (action === "claim") {
    const sameGuestSession = actor.guestSessionId && project.guestSessionId === actor.guestSessionId
    return {
      allowed: Boolean(sameGuestSession && !project.claimedAt),
      reason: sameGuestSession && !project.claimedAt ? undefined : "Project cannot be claimed by this user.",
    }
  }

  if (action === "preview" && project.guestSessionId && actor.guestSessionId === project.guestSessionId) {
    return { allowed: true }
  }

  return {
    allowed: false,
    reason: "Authenticated user does not own this project.",
  }
}
