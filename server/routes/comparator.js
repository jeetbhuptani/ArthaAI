import express from "express";
import { 
  getInvestmentRates, 
  generateInvestmentSummary 
} from "../controllers/comparatorController.js";

const router = express.Router();

// Routes for investment comparison tools
router.get("/investment-rates", getInvestmentRates);
router.post("/generate-investment-summary", generateInvestmentSummary);

export default router;