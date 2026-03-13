export class AppError extends Error {
  public readonly isOperational: boolean;

  constructor(
    public message: string,
    public statusCode: number = 500,
    public conflicts?: Record<string, string>, // Added for your unique field checks
  ) {
    super(message);

    this.statusCode = statusCode;
    // Marks the error as "expected" (client's fault) vs "unexpected" (server's fault)
    this.isOperational = true;

    // Captures where the error happened without including this class in the stack trace
    Error.captureStackTrace(this, this.constructor);

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
