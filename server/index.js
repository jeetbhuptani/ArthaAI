import express, { json } from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';
import { connect } from 'mongoose';
import auth from './routes/auth.js';
import wizard from './routes/wizard.js';
import analysisRoutes from "./routes/analysis.js";
import uploadRoutes from "./routes/upload.js";
import explainRoute from './routes/explain.js';
import learningRoute from './routes/learning.js';
import taxRoute from './routes/tax.js';
import compareRoute from './routes/comparator.js';
import newsRoute from './routes/news.js';
// Load environment variables
config();

// Verify environment variables are loaded
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables');
  process.exit(1);
}

const allowedOrigins = [
  'http://localhost:5173', // vite dev
  'https://storage.googleapis.com', // production bucket
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(json());

// MongoDB connection with error handling
const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// Initialize database connection
connectDB();

// --- Auth Routes ---
app.use('/api/ask', learningRoute); 
app.use('/api/auth', auth);
app.use('/api/user', wizard);
app.use('/api/analysis', analysisRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/explain', explainRoute);
app.use('/api/tax', taxRoute)
app.use('/api/compare', compareRoute);
app.use('/api/news', newsRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
