import {
  completeWizard,
  getWizardData,
} from "../controllers/completeWizard.js";
import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/complete-wizard", protect, completeWizard);
router.get("/get-wizard-data", protect, getWizardData);
export default router;
