import express from 'express';
import multer from 'multer';
import {
    addEntry,
    uploadCSV,
    calculateTax,
    generatePDF,
    getSuggestions
} from '../controllers/taxController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/entry', protect, addEntry);
router.post('/upload', protect, upload.single('file'), uploadCSV);
router.get('/calculate', protect, calculateTax);
router.get('/download-pdf', protect, generatePDF);
router.get('/ai-suggestions', protect, getSuggestions);

export default router;
