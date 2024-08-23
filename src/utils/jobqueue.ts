import Bull from "bull"
import { runLighthouse } from "./lighhouse"
import dotenv from "dotenv"
dotenv.config()

// Create a new Bull queue
const lighthouseQueue = new Bull("lighthouse", process.env.REDIS_URL as string)

// Define a job processor
lighthouseQueue.process(async (job) => {
  const { url } = job.data
  try {
    const result = await runLighthouse(url)
    return result // Return result to save in job
  } catch (error) {
    throw error
  }
})

// Function to add jobs to the queue
export function enqueueLighthouseJob(url: string) {
  return lighthouseQueue.add({ url })
}

export { lighthouseQueue }
