import axios from "axios"
import { Router } from "express"
import { AppError } from "../middlewares/errorHandler"
import prisma from "../utils/prismaClient"

const router = Router()

console.log(process.env.PAYSTACK_SECRET_KEY)

// Route to create a plan
router.post("/create_plan", async (req, res) => {
  const { name, interval, amount } = req.body

  try {
    if (!name || !interval || !amount) {
      throw new AppError("Invalid params", 400)
    }
    const params = {
      name: name,
      interval: interval,
      amount: amount * 100,
    }

    const response = await axios.post("https://api.paystack.co/plan", params, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })
    console.log(response.data)
    res.status(200).json({ status: "Success", result: response.data })
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message)
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message })
  }
})

router.get("/fetch_plans", async (req, res) => {
  try {
    // Send a GET request to Paystack to fetch the plans
    const response = await axios.get("https://api.paystack.co/plan", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    // Return the list of plans
    res.status(200).json({ status: "Success", result: response.data })
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message)
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message })
  }
})

// Route to initiate payment for first-time customers
router.post("/initiate_payment", async (req, res) => {
  const { email, amount, plan } = req.body

  try {
    if (!email || !amount || !plan) {
      throw new AppError("Invalid params", 400)
    }

    const params = {
      email: email,
      amount: amount * 100,
      metadata: {
        plan: plan,
        email,
      },
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      params,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
    console.log(response.data)
    res.status(200).json({ status: "Success", result: response.data })
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message)
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message })
  }
})

// Route to subscribe existing customers with an authorized card
router.post("/subscribe", async (req, res) => {
  const { customerId, plan } = req.body

  try {
    if (!customerId || !plan) {
      throw new AppError("Invalid params", 400)
    }

    const params = {
      plan: plan,
      customer: customerId,
    }

    const response = await axios.post(
      "https://api.paystack.co/subscription",
      params,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
    const subscriptionId = response.data.data.subscription_code // Extract the subscription ID
    console.log(subscriptionId)
    console.log(response.data)
    try {
      await prisma.user.update({
        where: { email: (req as any).user?.email },
        data: {
          customerid: customerId,
          subscriptionid: subscriptionId,
        },
      })
    } catch (error) {
      throw new AppError("Customer update failed", 500)
    }
    res.status(200).json({ status: "Success", result: response.data })
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message)
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message })
  }
})

export default router
