import { PrismaClient, Website } from "@prisma/client"
import { AppError } from "../middlewares/errorHandler"

class UserRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  public async create(websiteData: Omit<Website, "id">): Promise<Website> {
    try {
      return await this.prisma.website.create({ data: websiteData })
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 500)
      } else {
        throw new AppError("An unexpected error occurred", 500)
      }
    }
  }

  public async findById(websiteId: number): Promise<Website | null> {
    try {
      return await this.prisma.website.findUnique({ where: { id: websiteId } })
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 500)
      } else {
        throw new AppError("An unexpected error occurred", 500)
      }
    }
  }

  public async findAllUserWebsites(userid: number): Promise<Website[] | null> {
    try {
      return await this.prisma.website.findMany({ where: { userid: userid } })
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 500)
      } else {
        throw new AppError("An unexpected error occurred", 500)
      }
    }
  }

  public async deleteUser(websiteId: number): Promise<Website | null> {
    try {
      return await this.prisma.website.delete({ where: { id: websiteId } })
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 500)
      } else {
        throw new AppError("An unexpected error occurred", 500)
      }
    }
  }

  public async updateUser(
    websiteId: number,
    updates: Partial<Omit<Website, "id">>
  ): Promise<Website | null> {
    try {
      return await this.prisma.website.update({
        where: { id: websiteId },
        data: updates,
      })
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 500)
      } else {
        throw new AppError("An unexpected error occurred", 500)
      }
    }
  }
}

export default new UserRepository()
