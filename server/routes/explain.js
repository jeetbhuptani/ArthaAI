import express from 'express';
import { explainDocument } from '../controllers/explainController.js';
import { config } from 'dotenv';
config();

const router = express.Router();

router.post('/', explainDocument);

export default router;