import { AuthProvider, Prisma } from "@prisma/client"

import { prisma } from "@/infrastructure/db/prisma"

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  },

  createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data })
  },

  upsertGoogleUser(email: string) {
    return prisma.user.upsert({
      where: { email },
      update: { authProvider: AuthProvider.google },
      create: {
        email,
        authProvider: AuthProvider.google,
      },
    })
  },
}
