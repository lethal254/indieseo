import { Request, Response, NextFunction } from "express"
import { AppError } from "./errorHandler"

export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.isAuthenticated()) {
    return next()
  }
  throw new AppError("Not authenticated", 401)
}
