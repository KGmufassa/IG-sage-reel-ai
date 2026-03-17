export type CreateProjectInput = {
  title: string
  globalContext?: string | null
  stylePreset?: string | null
  actor:
    | { kind: "authenticated"; userId: string }
    | { kind: "guest"; guestSessionId: string; expiresAt: Date }
}

export type UpdateProjectInput = {
  title?: string
  globalContext?: string | null
  stylePreset?: string | null
}
