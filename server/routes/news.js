import express from 'express';
import { getFinanceNews, summarizeText } from '../controllers/newsController.js';

const router = express.Router();

router.get('/finance-india', getFinanceNews);
router.post('/summarize', summarizeText);

export default router;