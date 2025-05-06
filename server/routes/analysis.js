import express from "express"
import { analyzeUserPortfolio } from "../controllers/analysisController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

router.post("/", protect, analyzeUserPortfolio)

export default router
