import { Request, Response } from "express"
import { AppError } from "../middlewares/errorHandler"

class UserController {
  public getUser = async (req: Request, res: Response) => {
    if (req.user) {
      res.status(200).send({
        status: "Success",
        user: req.user,
      })
    } else {
      throw new AppError("User not found", 404)
    }
  }
}

export default new UserController()
