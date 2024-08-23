import { Website as WB } from "@prisma/client"
import Website from "../repositories/Website"

class WebsiteService {
  public createWebsite = async (websiteData: Omit<WB, "id">): Promise<WB> => {
    const website = await Website.create(websiteData)
    return website
  }
  public findUserWebsites = async (userid: number): Promise<WB[]> => {
    const websites = await Website.findAllUserWebsites(userid)
    if (websites) {
      return websites
    } else {
      return []
    }
  }

  public findWebsiteById = async (websiteId: number): Promise<WB | null> => {
    const website = await Website.findById(websiteId)
    return website
  }

  public deleteWebsite = async (websiteId: number): Promise<WB | null> => {
    const website = await Website.deleteUser(websiteId)
    return website
  }

  public updateWebsite = async (
    websiteId: number,
    updates: Partial<Omit<WB, "id">>
  ): Promise<WB | null> => {
    const website = await Website.updateUser(websiteId, updates)
    return website
  }
}

export default new WebsiteService()
