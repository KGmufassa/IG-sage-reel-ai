import { Prisma } from "@prisma/client"

import { prisma } from "@/infrastructure/db/prisma"

export const projectRepository = {
  createAuthenticatedProject(data: {
    title: string
    userId: string
    globalContext?: string | null
    stylePreset?: string | null
  }) {
    return prisma.project.create({
      data: {
        title: data.title,
        ownerId: data.userId,
        globalContext: data.globalContext,
        stylePreset: data.stylePreset,
      },
      include: {
        scenes: true,
      },
    })
  },

  createGuestProject(data: {
    title: string
    guestSessionId: string
    expiresAt: Date
    globalContext?: string | null
    stylePreset?: string | null
  }) {
    return prisma.project.create({
      data: {
        title: data.title,
        guestSessionId: data.guestSessionId,
        expiresAt: data.expiresAt,
        globalContext: data.globalContext,
        stylePreset: data.stylePreset,
      },
      include: {
        scenes: true,
      },
    })
  },

  findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        scenes: {
          orderBy: { orderIndex: "asc" },
          include: {
            assets: {
              orderBy: [{ layerOrder: "asc" }, { createdAt: "asc" }],
            },
            processingJobs: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
        playbackPlans: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    })
  },

  findAccessibleProjects(actor: { kind: "authenticated"; userId: string } | { kind: "guest"; guestSessionId: string }) {
    return prisma.project.findMany({
      where:
        actor.kind === "authenticated"
          ? { ownerId: actor.userId }
          : { guestSessionId: actor.guestSessionId },
      include: {
        scenes: {
          orderBy: { orderIndex: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    })
  },

  countGuestProjects(guestSessionId: string) {
    return prisma.project.count({
      where: {
        guestSessionId,
        ownerId: null,
      },
    })
  },

  update(id: string, data: { title?: string; globalContext?: string | null; stylePreset?: string | null }) {
    return prisma.project.update({
      where: { id },
      data,
      include: {
        scenes: {
          orderBy: { orderIndex: "asc" },
        },
      },
    })
  },

  async delete(id: string) {
    await prisma.project.delete({
      where: { id },
    })
  },

  claim(id: string, data: { userId: string; guestSessionId: string }) {
    return prisma.$transaction(async (tx) => {
      const claimedAt = new Date()

      await tx.guestSession.update({
        where: { id: data.guestSessionId },
        data: {
          claimedAt,
          claimedByUserId: data.userId,
        },
      })

      return tx.project.update({
        where: { id },
        data: {
          ownerId: data.userId,
          guestSessionId: null,
          claimedAt,
          claimedByUserId: data.userId,
          expiresAt: null,
        },
        include: {
          scenes: {
            orderBy: { orderIndex: "asc" },
          },
        },
      })
    })
  },

  latestPlaybackPlan(projectId: string, options?: { isReducedMotion?: boolean; onlyValid?: boolean }) {
    return prisma.playbackPlan.findFirst({
      where: {
        projectId,
        ...(options?.isReducedMotion === undefined ? {} : { isReducedMotion: options.isReducedMotion }),
      },
      orderBy: [{ version: "desc" }, { createdAt: "desc" }],
    })
  },

  nextPlaybackPlanVersion(projectId: string) {
    return prisma.playbackPlan.aggregate({
      where: { projectId },
      _max: { version: true },
    })
  },

  createPlaybackPlan(data: {
    projectId: string
    version: number
    timelineJson: Prisma.InputJsonValue
    isReducedMotion?: boolean
    isFallback?: boolean
  }) {
    return prisma.playbackPlan.create({
      data: {
        projectId: data.projectId,
        version: data.version,
        timelineJson: data.timelineJson,
        isReducedMotion: data.isReducedMotion ?? false,
        isFallback: data.isFallback ?? false,
      },
    })
  },

  deleteExpiredGuestProjects(now: Date) {
    return prisma.project.deleteMany({
      where: {
        ownerId: null,
        guestSessionId: { not: null },
        claimedAt: null,
        expiresAt: { lt: now },
      },
    })
  },

  deleteExpiredGuestSessions(now: Date) {
    return prisma.guestSession.deleteMany({
      where: {
        expiresAt: { lt: now },
        claimedAt: null,
        projects: {
          none: {},
        },
      },
    })
  },
}
