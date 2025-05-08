import express from "express";
import { connectZerodha, getPortfolioData } from "../controllers/zerodhaController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Connect Zerodha account
router.post("/connect", protect, connectZerodha);

// Get portfolio data from Zerodha
router.get("/portfolio", protect, getPortfolioData);

export default router;