import { Router } from "express"
import AuditResultsController from "../controllers/AuditResultsController"

const router = Router()

router.get("/:websiteid", AuditResultsController.getAuditResults)

export default router
