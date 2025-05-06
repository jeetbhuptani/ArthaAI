import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Tesseract from 'tesseract.js';
import { analyzeDocument } from '../services/documentParserService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.file.filename);
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    fs.unlinkSync(filePath);

    const analysis = analyzeDocument(text);
    res.json({ text, ...analysis });
  } catch (error) {
    console.error(error);
    res.status(500).send('OCR or Parsing Failed');
  }
});

export default router;
