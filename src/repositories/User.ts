import { PrismaClient, User } from "@prisma/client"
import { AppError } from "../middlewares/errorHandler"

class UserRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  public async create(userData: Omit<User, "id">): Promise<User> {
    try {
      return await this.prisma.user.create({ data: userData })
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 500)
      } else {
        throw new AppError("An unexpected error occurred", 500)
      }
    }
  }

  public async findById(userId: number): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { id: userId } })
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 500)
      } else {
        throw new AppError("An unexpected error occurred", 500)
      }
    }
  }

  public async deleteUser(userId: number): Promise<User | null> {
    try {
      return await this.prisma.user.delete({ where: { id: userId } })
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 500)
      } else {
        throw new AppError("An unexpected error occurred", 500)
      }
    }
  }

  public async updateUser(
    userId: number,
    updates: Partial<Omit<User, "id">>
  ): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
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
