import { describe, expect, it } from "vitest"

import { registerInputSchema } from "@/modules/auth/validator"

describe("registerInputSchema", () => {
  it("accepts a valid email and password", () => {
    const result = registerInputSchema.safeParse({
      email: "creator@example.com",
      password: "strong-pass-123",
    })

    expect(result.success).toBe(true)
  })

  it("rejects a short password", () => {
    const result = registerInputSchema.safeParse({
      email: "creator@example.com",
      password: "short",
    })

    expect(result.success).toBe(false)
  })
})
