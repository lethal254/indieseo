import { Router } from "express"
import UserController from "../controllers/UserController"

const router = Router()

router.get("/", UserController.getUser)

export default router
