import express from 'express';
import { 
  signup, 
  login, 
  googleAuth, 
  getMe, 
  verifyToken,
  updateProfile,
} from '../controllers/authController.js';
import { completeWizard } from '../controllers/completeWizard.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.get('/verify', protect, verifyToken);
router.put('/profile', protect, updateProfile);
router.post('/complete-wizard', protect, completeWizard);

export default router;