import { Request, Response } from "express"
import { AppError } from "../middlewares/errorHandler"
import prisma from "../utils/prismaClient"

class AuditResultsController {
  public getAuditResults = async (req: Request, res: Response) => {
    const websiteid = req.params.websiteid
    try {
      const auditResults = await prisma.auditResults.findMany({
        where: { websiteid: parseInt(websiteid) },
      })
      res.status(200).send({
        status: "Success",
        results: auditResults.map((result) => ({
          scores: (result as any)?.result?.scores!,
          metrics: (result as any)?.result?.metrics,
          fetchedAt: (result as any)?.result?.fetchedAt,
        })),
      })
    } catch (error) {
      throw new AppError("Something went wrong fetching audit results", 500)
    }
  }
}

export default new AuditResultsController()
