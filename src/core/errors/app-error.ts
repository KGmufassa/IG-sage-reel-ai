export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: Record<string, unknown>

  constructor(options: {
    message: string
    statusCode: number
    code: string
    details?: Record<string, unknown>
  }) {
    super(options.message)
    this.name = "AppError"
    this.statusCode = options.statusCode
    this.code = options.code
    this.details = options.details
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}
