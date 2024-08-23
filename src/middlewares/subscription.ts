import { Request, Response, NextFunction } from "express"
import { AppError } from "./errorHandler"
import prisma from "../utils/prismaClient"
import axios from "axios"

export const ensureSubscribed = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Ensure the user is authenticated
  if (!req.isAuthenticated()) {
    throw new AppError("Not authenticated", 401)
  }

  // Retrieve user data from the database
  const user = await prisma.user.findUnique({
    where: { email: (req as any).user?.email }, // Adjust based on how you store user info
  })

  if (!user) {
    throw new AppError("User not found", 404)
  }

  // Check if the user has a Paystack customer ID
  if (!user.customerid) {
    req.user = { ...user, subscribed: false }
    return next()
  }

  try {
    // Verify subscription status with Paystack
    const subscriptionResponse = await axios.get(
      `https://api.paystack.co/subscription/${user.subscriptionid}`, // Assuming subscription ID is stored as customerId
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const subscriptionData = subscriptionResponse.data.data
    const isSubscribed = subscriptionData.status === "active" // Adjust based on Paystack's response

    // Add 'subscribed' property to req.user
    req.user = {
      ...user,
      subscribed: isSubscribed,
    }
    const updatedUser = await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        subscribed: true, //Change this to is subscribed
      },
    })
    // Proceed to the next middleware or route handler
    next()
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message)
    throw new AppError("Failed to verify subscription", 500)
  }
}
