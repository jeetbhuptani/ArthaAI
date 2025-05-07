import express from 'express';
import { 
  askArthaAI, 
  saveConversation, 
  getSavedConversations, 
  getConversation,
  deleteConversation
} from '../controllers/learningController.js';
import { protect } from '../middleware/auth.js'; 

const router = express.Router();

router.post('/', askArthaAI);
router.post('/save', protect, saveConversation);
router.get('/conversations', protect, getSavedConversations);
router.get('/conversations/:id', protect, getConversation);
router.delete('/conversations/:id', protect, deleteConversation);

export default router;