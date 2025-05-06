import { completeWizard } from '../controllers/completeWizard.js';
import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/complete-wizard', protect, completeWizard);

export default router;