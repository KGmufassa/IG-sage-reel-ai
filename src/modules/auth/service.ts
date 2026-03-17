import bcrypt from "bcryptjs"
import { AuthProvider } from "@prisma/client"

import { AppError } from "@/core/errors/app-error"
import { authRepository } from "@/modules/auth/repository"
import type { RegisterInput } from "@/modules/auth/types"

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await authRepository.findByEmail(input.email)

    if (existingUser) {
      throw new AppError({
        code: "EMAIL_ALREADY_IN_USE",
        message: "An account with this email already exists.",
        statusCode: 409,
      })
    }

    const passwordHash = await bcrypt.hash(input.password, 12)

    const user = await authRepository.createUser({
      email: input.email,
      authProvider: AuthProvider.credentials,
      passwordHash,
    })

    return {
      id: user.id,
      email: user.email,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
    }
  },
}
