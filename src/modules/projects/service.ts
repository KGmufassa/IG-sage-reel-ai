import { AppError } from "@/core/errors/app-error"
import { getEnv } from "@/config/env"
import { DEFAULT_PROJECT_OUTPUT_FORMAT } from "@/config/constants"
import { projectRepository } from "@/modules/projects/repository"
import type { CreateProjectInput, UpdateProjectInput } from "@/modules/projects/types"

export const projectService = {
  async create(input: CreateProjectInput) {
    if (input.actor.kind === "authenticated") {
      const project = await projectRepository.createAuthenticatedProject({
        title: input.title,
        userId: input.actor.userId,
        globalContext: input.globalContext,
        stylePreset: input.stylePreset,
      })

      return {
        ...project,
        outputFormat: DEFAULT_PROJECT_OUTPUT_FORMAT,
      }
    }

    if (!input.actor.guestSessionId) {
      throw new AppError({
        code: "GUEST_SESSION_REQUIRED",
        message: "A guest session is required to create a guest project.",
        statusCode: 401,
      })
    }

    const env = getEnv()
    const guestProjectCount = await projectRepository.countGuestProjects(input.actor.guestSessionId)

    if (guestProjectCount >= env.GUEST_MAX_PROJECTS) {
      throw new AppError({
        code: "GUEST_PROJECT_QUOTA_EXCEEDED",
        message: `Guest users may only keep ${env.GUEST_MAX_PROJECTS} active projects.`,
        statusCode: 429,
      })
    }

    const project = await projectRepository.createGuestProject({
      title: input.title,
      guestSessionId: input.actor.guestSessionId,
      expiresAt: input.actor.expiresAt,
      globalContext: input.globalContext,
      stylePreset: input.stylePreset,
    })

    return {
      ...project,
      outputFormat: DEFAULT_PROJECT_OUTPUT_FORMAT,
    }
  },

  async list(actor: { kind: "authenticated"; userId: string } | { kind: "guest"; guestSessionId: string }) {
    return projectRepository.findAccessibleProjects(actor)
  },

  async getById(projectId: string) {
    const project = await projectRepository.findById(projectId)

    if (!project) {
      throw new AppError({
        code: "PROJECT_NOT_FOUND",
        message: "Project was not found.",
        statusCode: 404,
      })
    }

    return project
  },

  async update(projectId: string, input: UpdateProjectInput) {
    return projectRepository.update(projectId, input)
  },

  async remove(projectId: string) {
    await projectRepository.delete(projectId)
  },

  async claim(projectId: string, input: { userId: string; guestSessionId: string }) {
    const project = await this.getById(projectId)

    if (!project.guestSessionId || project.guestSessionId !== input.guestSessionId) {
      throw new AppError({
        code: "CLAIM_NOT_ALLOWED",
        message: "Project does not belong to the current guest session.",
        statusCode: 403,
      })
    }

    if (project.claimedAt || project.ownerId) {
      throw new AppError({
        code: "PROJECT_ALREADY_CLAIMED",
        message: "Project has already been claimed.",
        statusCode: 409,
      })
    }

    if (project.expiresAt && project.expiresAt.getTime() <= Date.now()) {
      throw new AppError({
        code: "PROJECT_EXPIRED",
        message: "Expired guest projects cannot be claimed.",
        statusCode: 410,
      })
    }

    return projectRepository.claim(projectId, input)
  },
}
