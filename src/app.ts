import express from "express"
import dotenv from "dotenv"
import session from "express-session"
import passport from "passport"
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import auditRoutes from "./routes/auditRoutes"
import websiteRoutes from "./routes/WebsiteRoutes"
import auditResults from "./routes/auditResultsRoutes"
import paymentRoutes from "./routes/paymentRoutes"
import callbacks from "./routes/callbacksRoutes"
import "./middlewares/passportConfig" // Ensure this import is present
import { ensureAuthenticated } from "./middlewares/auth"
import { ensureSubscribed } from "./middlewares/subscription"

import { errorHandler, notFoundHandler } from "./middlewares/errorHandler"
import cors from "cors"
import morgan from "morgan"

dotenv.config()

const app = express()
const PORT = process.env.PORT || ""

app.set("trust proxy", 1)
app.enable("trust proxy")

app.use(express.json())
app.use(morgan("tiny"))
const allowedOrigins = [
  "https://indieseo-frontend.vercel.app",
  "http://localhost:3000",
]

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin."
        return callback(new Error(msg), false)
      }
      return callback(null, true)
    },
    credentials: true,
  })
)
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only use secure in production
      httpOnly: true,
      sameSite: "none", // Required for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    proxy: true, // trust the reverse proxy
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use("/auth", authRoutes)
app.use("/cb", callbacks)
app.use(ensureAuthenticated)

app.get("/", (req, res) => {
  res.send("Hello, authenticated user!")
})
app.use("/payment", paymentRoutes)
app.use(ensureSubscribed)
app.use("/user", userRoutes)
app.use("/audit", auditRoutes)
app.use("/website", websiteRoutes)
app.use("/audit_results", auditResults)

// Catch all undefined routes and return a 404
app.use(notFoundHandler)

// Global error handler
app.use(errorHandler)

if (!PORT) {
  throw new Error("PORT env variable needs to be defined")
} else {
  app.listen(PORT, () => {
    console.log("App is listening on port " + PORT)
  })
}
