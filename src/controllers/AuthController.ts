import { Request, Response, NextFunction } from "express"
import passport from "passport"
import catchAsync from "../utils/catchAsync"

class AuthController {
  public googleAuth(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    )
  }
  public googleCallback = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate("google", { failureRedirect: "/" }, (err, user) => {
        if (err || !user) {
          return res.redirect("/")
        }
        req.logIn(user, (err) => {
          if (err) {
            return res.redirect("/")
          }
          res.redirect("http://localhost:3000/dashboard")
        })
      })(req, res, next)
    }
  )

  public logout(req: Request, res: Response): void {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.redirect("/")
    })
  }
}
export default new AuthController()
