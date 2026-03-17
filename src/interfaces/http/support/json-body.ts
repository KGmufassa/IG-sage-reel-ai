import { ZodSchema } from "zod"

import { AppError } from "@/core/errors/app-error"

export async function parseJsonBody<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  const body = await request.json().catch(() => {
    throw new AppError({
      code: "INVALID_JSON",
      message: "Request body must be valid JSON.",
      statusCode: 400,
    })
  })

  return schema.parse(body)
}
