import { Router } from "express"
import { runLighthouse } from "../utils/lighhouse"
import { enqueueLighthouseJob, lighthouseQueue } from "../utils/jobqueue"
import AuditController from "../controllers/AuditController"

const router = Router()

router.get("/", AuditController.initiateAudit)

router.post("/status/:jobId", AuditController.getAuditJobStatus)

export default router
