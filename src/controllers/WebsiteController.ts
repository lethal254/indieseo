import { Request, Response } from "express"
import { AppError } from "../middlewares/errorHandler"
import { User, Website } from "@prisma/client"
import WebsiteService from "../services/WebsiteService"

interface Ierror extends Error {}

class WebsiteController {
  public async createWebsite(req: Request, res: Response) {
    let websiteData = req.body as Omit<Website, "id">
    if (req.user) {
      websiteData.userid = (req.user as User).id
    } else {
      throw new AppError("User not authorised", 403)
    }

    if (!websiteData.domain || !websiteData.url) {
      throw new AppError("Incorrect body", 400)
    }

    try {
      console.log("Enqueuing Lighthouse job...")
      const website = await WebsiteService.createWebsite(websiteData)
      res.status(202).json({ message: "Success", result: website })
    } catch (error) {
      console.error("Error creating website", error)
      res.status(500).json({ error: (error as Ierror).message })
    }
  }

  public async findWebsiteById(req: Request, res: Response) {
    const websiteId = parseInt(req.params.id)
    if (isNaN(websiteId)) {
      throw new AppError("Invalid website ID", 400)
    }

    try {
      const website = await WebsiteService.findWebsiteById(websiteId)
      if (!website) {
        throw new AppError("Website not found", 404)
      }
      res.status(200).json({ message: "Success", result: website })
    } catch (error) {
      console.error("Error finding website", error)
      res.status(500).json({ error: (error as Ierror).message })
    }
  }
  public async findUserWebsites(req: Request, res: Response) {
    const userid = (req.user as User).id
    if (!userid) {
      throw new AppError("Not authenticated", 401)
    }

    try {
      const websites = await WebsiteService.findUserWebsites(userid)

      res.status(200).json({ message: "Success", result: websites })
    } catch (error) {
      console.error("Error finding website", error)
      res.status(500).json({ error: (error as Ierror).message })
    }
  }

  public async deleteWebsite(req: Request, res: Response) {
    const websiteId = parseInt(req.params.id)
    if (isNaN(websiteId)) {
      throw new AppError("Invalid website ID", 400)
    }

    try {
      const website = await WebsiteService.deleteWebsite(websiteId)
      if (!website) {
        throw new AppError("Website not found", 404)
      }
      res
        .status(200)
        .json({ message: "Website deleted successfully", result: website })
    } catch (error) {
      console.error("Error deleting website", error)
      res.status(500).json({ error: (error as Ierror).message })
    }
  }

  public async updateWebsite(req: Request, res: Response) {
    const websiteId = parseInt(req.params.id)
    const updates = req.body as Partial<Omit<Website, "id">>

    if (isNaN(websiteId)) {
      throw new AppError("Invalid website ID", 400)
    }

    try {
      const website = await WebsiteService.updateWebsite(websiteId, updates)
      if (!website) {
        throw new AppError("Website not found", 404)
      }
      res
        .status(200)
        .json({ message: "Website updated successfully", result: website })
    } catch (error) {
      console.error("Error updating website", error)
      res.status(500).json({ error: (error as Ierror).message })
    }
  }
}

export default new WebsiteController()
