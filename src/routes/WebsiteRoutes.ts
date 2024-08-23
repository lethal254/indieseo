import { Router } from "express"
import WebsiteControllers from "../controllers/WebsiteController"

const router = Router()

// Create a new website
router.post("/create", WebsiteControllers.createWebsite)
router.get("/all", WebsiteControllers.findUserWebsites)

// Get a website by ID
router.get("/:id", WebsiteControllers.findWebsiteById)

// Delete a website by ID
router.delete("/:id", WebsiteControllers.deleteWebsite)

// Update a website by ID
router.put("/:id", WebsiteControllers.updateWebsite)

export default router
