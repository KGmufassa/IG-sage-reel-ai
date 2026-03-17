import { ok } from "@/lib/api-response"
import { parseJsonBody } from "@/interfaces/http/support/json-body"
import { resolveRequestActor } from "@/interfaces/http/support/request-actor"
import { ensureProjectAccess } from "@/interfaces/http/support/authorization"
import { initiateUploadsInputSchema } from "@/modules/uploads"
import { projectService } from "@/modules/projects"
import { uploadService } from "@/modules/uploads"
import type { RequestContext } from "@/core/request/context"

export const uploadController = {
  async initiate(projectId: string, request: Request, context: RequestContext) {
    const actor = await resolveRequestActor()
    const project = await projectService.getById(projectId)
    ensureProjectAccess(actor, "edit", project)
    const input = await parseJsonBody(request, initiateUploadsInputSchema)
    const uploads = uploadService.createUploadContracts(projectId, input.files)
    return ok({ uploads }, { correlationId: context.correlationId })
  },
}
