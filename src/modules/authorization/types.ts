export type AuthorizationAction = "preview" | "edit" | "save" | "claim" | "export"

export type AuthorizationActor =
  | {
      kind: "anonymous"
    }
  | {
      kind: "guest"
      guestSessionId: string
      expiresAt?: Date | null
    }
  | {
      kind: "authenticated"
      userId: string
      guestSessionId?: string | null
    }

export type AuthorizationProject = {
  ownerId: string | null
  guestSessionId: string | null
  claimedAt: Date | null
  expiresAt: Date | null
}

export type AuthorizationDecision = {
  allowed: boolean
  reason?: string
}
