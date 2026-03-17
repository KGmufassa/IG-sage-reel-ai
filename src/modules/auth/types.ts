export type SessionActor =
  | {
      kind: "anonymous"
    }
  | {
      kind: "guest"
      guestSessionId: string
    }
  | {
      kind: "authenticated"
      userId: string
      email: string
      guestSessionId?: string | null
    }

export type AuthenticatedUserRecord = {
  id: string
  email: string
  authProvider: "credentials" | "google"
  passwordHash: string | null
}

export type RegisterInput = {
  email: string
  password: string
}
