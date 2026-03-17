import { getEnv } from "@/config/env"
import { metrics } from "@/core/observability/metrics"
import { logProcessingEvent } from "@/core/observability/processing-log"
import { projectRepository } from "@/modules/projects/repository"
import { sceneRepository } from "@/modules/scenes/repository"
import { sceneService } from "@/modules/scenes"

export const maintenanceService = {
  async cleanupExpiredGuestResources(traceId?: string | null) {
    const now = new Date()
    const deletedProjects = await projectRepository.deleteExpiredGuestProjects(now)
    const deletedSessions = await projectRepository.deleteExpiredGuestSessions(now)

    metrics.increment("guest_cleanup_deleted_projects_total", deletedProjects.count)
    metrics.increment("guest_cleanup_deleted_sessions_total", deletedSessions.count)

    logProcessingEvent({
      event: "guest cleanup completed",
      traceId,
      details: {
        deletedProjects: deletedProjects.count,
        deletedSessions: deletedSessions.count,
      },
    })

    return {
      deletedProjects: deletedProjects.count,
      deletedSessions: deletedSessions.count,
    }
  },

  async recoverTimedOutJobs(traceId?: string | null) {
    const env = getEnv()
    const timeoutBefore = new Date(Date.now() - env.PROCESSING_JOB_TIMEOUT_MS)
    const jobs = await sceneRepository.findTimedOutJobs(timeoutBefore)

    for (const job of jobs) {
      await sceneService.markFailed(job.id, job.sceneId, "Processing timed out and was recovered by maintenance.", job.attemptCount + 1)
      logProcessingEvent({
        event: "timed out job recovered",
        traceId,
        projectId: job.scene.projectId,
        sceneId: job.sceneId,
        jobId: job.id,
      })
    }

    metrics.gauge("processing_queue_depth", 0)

    return {
      recoveredJobs: jobs.length,
    }
  },
}
