import { createClient } from "@supabase/supabase-js"
import { AppError } from "../middlewares/errorHandler"
import dotenv from "dotenv"

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_PROJECT_URL || ""
const SUPABASE_PRIVATE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

if (!SUPABASE_URL && !SUPABASE_PRIVATE_KEY) {
  throw new AppError("File upload credentials not configured", 500)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_PRIVATE_KEY)

export default supabase
