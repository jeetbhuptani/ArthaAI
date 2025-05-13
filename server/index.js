import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import auth from './routes/auth.js';
import wizard from './routes/wizard.js';
import analysisRoutes from "./routes/analysis.js";
import uploadRoutes from "./routes/upload.js";
import explainRoute from './routes/explain.js';
import learningRoute from './routes/learning.js';
import taxRoute from './routes/tax.js';
import compareRoute from './routes/comparator.js';
import newsRoute from './routes/news.js';
import path from 'path';

// Load environment variables
config();
const app = express();

//middlewares
app.use(json());
app.use(cors());

// For Deployment
const __dirname = path.resolve();

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

if(process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, "/client/dist")));

    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));