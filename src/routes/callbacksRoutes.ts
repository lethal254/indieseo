import { Router } from "express"
import { AppError } from "../middlewares/errorHandler"
import prisma from "../utils/prismaClient"
import axios from "axios"

const router = Router()

router.get("/payment_callback", async (req, res) => {
  const { reference } = req.query

  try {
    if (!reference) {
      throw new AppError("Invalid params", 400)
    }

    // Verify the transaction with Paystack
    const verificationResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const { metadata, customer, status } = verificationResponse.data.data

    if (status !== "success") {
      throw new AppError("Transaction failed", 400)
    }

    const { plan } = metadata
    const customerId = customer.customer_code

    // Create a subscription with Paystack
    const subscriptionParams = {
      customer: customerId,
      plan: plan,
    }

    const subscriptionResponse = await axios.post(
      "https://api.paystack.co/subscription",
      subscriptionParams,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    const subscriptionId = subscriptionResponse.data.data.subscription_code // Extract the subscription ID
    console.log(subscriptionId)

    // Update the user record with the customer ID and subscription ID
    try {
      await prisma.user.update({
        where: { email: metadata.email },
        data: {
          customerid: customerId,
          subscriptionid: subscriptionId,
        },
      })
    } catch (error) {
      throw new AppError("Customer update failed", 500)
    }

    // Log and redirect
    console.log(
      "Redirection URL:",
      "https://indieseo-frontend.vercel.app/dashboard"
    )
    res.redirect(303, "https://indieseo-frontend.vercel.app/dashboard")
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message)
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message })
  }
})

export default router
