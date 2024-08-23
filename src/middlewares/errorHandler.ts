import { Request, Response, NextFunction } from "express"

class AppError extends Error {
  statusCode: number
  status: string

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"

    Error.captureStackTrace(this)
  }
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500
  const status = err.status || "error"

  res.status(statusCode).json({
    status,
    message: err.message,
  })
}

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError("Not Found", 404)
  next(err)
}

export { AppError, errorHandler, notFoundHandler }
