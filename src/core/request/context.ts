import { headers } from "next/headers"

export type RequestContext = {
  correlationId: string
  path: string
  method: string
}

function randomId() {
  return crypto.randomUUID()
}

export async function buildRequestContext(path: string, method: string): Promise<RequestContext> {
  const headerStore = await headers()
  const correlationId = headerStore.get("x-correlation-id") ?? randomId()

  return {
    correlationId,
    path,
    method,
  }
}
