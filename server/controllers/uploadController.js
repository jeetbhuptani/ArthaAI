import fs from 'fs';
import Tesseract from 'tesseract.js';
import { analyzeDocument } from '../services/documentParserService.js';

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    fs.unlinkSync(filePath);

    const analysis = analyzeDocument(text);
    res.json({ text, ...analysis });
  } catch (error) {
    console.error(error);
    res.status(500).send('OCR or Parsing Failed');
  }
};