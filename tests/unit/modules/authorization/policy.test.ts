import { describe, expect, it } from "vitest"

import { authorizeProjectAction } from "@/modules/authorization"

describe("authorizeProjectAction", () => {
  it("allows guest preview for owned guest project", () => {
    const decision = authorizeProjectAction(
      { kind: "guest", guestSessionId: "guest-1" },
      "preview",
      {
        ownerId: null,
        guestSessionId: "guest-1",
        claimedAt: null,
        expiresAt: null,
      },
    )

    expect(decision.allowed).toBe(true)
  })

  it("prevents guest save access", () => {
    const decision = authorizeProjectAction(
      { kind: "guest", guestSessionId: "guest-1" },
      "save",
      {
        ownerId: null,
        guestSessionId: "guest-1",
        claimedAt: null,
        expiresAt: null,
      },
    )

    expect(decision.allowed).toBe(false)
  })

  it("allows authenticated claim for matching guest session", () => {
    const decision = authorizeProjectAction(
      { kind: "authenticated", userId: "user-1", guestSessionId: "guest-1" },
      "claim",
      {
        ownerId: null,
        guestSessionId: "guest-1",
        claimedAt: null,
        expiresAt: null,
      },
    )

    expect(decision.allowed).toBe(true)
  })
})
