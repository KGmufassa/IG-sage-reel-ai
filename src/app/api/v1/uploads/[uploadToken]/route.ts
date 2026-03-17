import { defineRoute } from "@/core/http/route-handler"
import { ok } from "@/lib/api-response"
import { uploadService } from "@/modules/uploads"

export const PUT = defineRoute(async (request, context) => {
  const uploadToken = request.nextUrl.pathname.split("/").at(-1) ?? ""
  const verified = uploadService.verifyUploadToken(uploadToken)

  return ok(
    {
      accepted: true,
      storageKey: verified.storageKey,
      expiresAt: verified.expiresAt,
    },
    { correlationId: context.correlationId },
  )
})
