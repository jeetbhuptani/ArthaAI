import express from 'express';
import { 
  signup, 
  login, 
  getMe, 
  verifyToken,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/verify', protect, verifyToken);
router.put('/profile', protect, updateProfile);

export default router;