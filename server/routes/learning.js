import express from "express"
import { askArthaAI } from "../controllers/learningController.js"

const router = express.Router()

router.post("/", askArthaAI)

export default router