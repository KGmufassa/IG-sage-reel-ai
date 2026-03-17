import { prisma } from "@/infrastructure/db/prisma"

export const guestSessionRepository = {
  create(data: { expiresAt: Date }) {
    return prisma.guestSession.create({
      data,
    })
  },

  findById(id: string) {
    return prisma.guestSession.findUnique({
      where: { id },
    })
  },

  touch(id: string) {
    return prisma.guestSession.update({
      where: { id },
      data: {
        lastSeenAt: new Date(),
      },
    })
  },
}
