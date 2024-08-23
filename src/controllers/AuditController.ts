import { Request, Response, NextFunction } from "express"
import { enqueueLighthouseJob, lighthouseQueue } from "../utils/jobqueue"
import { AppError } from "../middlewares/errorHandler"
import prisma from "../utils/prismaClient"

export interface IError extends AppError {}

class AuditController {
  public async initiateAudit(req: Request, res: Response) {
    const url = req.query.url as string

    if (!url) {
      throw new AppError("url query is required", 400)
    }

    try {
      console.log("Enqueuing Lighthouse job...")
      const job = await enqueueLighthouseJob(url)
      console.log(job)
      res.status(202).json({
        message: "Lighthouse audit started",
        result: { jobid: job.id },
      })
    } catch (error) {
      console.error("Error enqueuing job:", error)
      res.status(500).json({ error })
    }
  }
  public async getAuditJobStatus(req: Request, res: Response) {
    const jobId = req.params.jobId
    const websiteId = req.body.websiteId
    console.log(jobId)

    try {
      const job = await lighthouseQueue.getJob(jobId)
      console.log(job)

      if (job) {
        const state = await job.getState()
        const result = job.returnvalue // Retrieve result if available

        // Validate that websiteId is provided
        if (!websiteId) {
          throw new AppError("Website ID is required", 400)
        }

        const existingResult = await prisma.auditResults.findFirst({
          where: { websiteid: websiteId, jobid: parseInt(jobId) },
        })

        if (!existingResult && !!result) {
          // Save the result to the database if it doesn't already exist
          await prisma.auditResults.create({
            data: {
              websiteid: websiteId,
              jobid: parseInt(jobId), // Ensure jobId is stored to prevent duplicates
              result: result,
            },
          })
        }

        res.status(200).json({ state, result })
      } else {
        throw new AppError("Job not found", 404)
      }
    } catch (error) {
      console.error(error) // Log the error for debugging
      res
        .status(parseInt((error as IError).status) || 500)
        .json({ error: (error as IError).message || "Internal Server Error" })
    }
  }
}
export default new AuditController()
