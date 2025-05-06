import express, { json } from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { config } from 'dotenv'
import { connect } from 'mongoose'
import auth from './routes/auth.js'
import wizard from './routes/wizard.js'
import analysisRoutes from "./routes/analysis.js"
import uploadRoutes from "./routes/upload.js"
import explainRoute from './routes/explain.js';

// Load environment variables
config()

// Verify environment variables are loaded
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables')
  process.exit(1)
}

const app = express()
app.use(cors())
app.use(json())

// MongoDB connection with error handling
const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI)
    console.log('MongoDB connected successfully')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

// Initialize database connection
connectDB()

// --- Gemini AI Setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const SYSTEM_PROMPT = `
You are Artha AI, a warm, friendly Indian financial coach who simplifies money matters.
Your audience includes first-time earners, students, small business owners, and homemakers.
Always explain using:
- clear, jargon-free Hindi-English (Hinglish) when possible,
- if user asked in Hindi, respond in Hinglish else respond in English,
- relatable Indian examples (e.g., chai stall, kirana store, LIC policy, Paytm wallet),
- short, easy paragraphs and points,
- only answer the questions related to finance, money, and investment else politely refuse to answer

Keep your tone friendly, encouraging, and non-judgmental.
`

app.post('/api/ask', async (req, res) => {
  const { question } = req.body

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
    const result = await model.generateContent({
      contents: [
        {
          parts: [
            { text: `${SYSTEM_PROMPT}\n\nQ: ${question}\n\nA:` }
          ]
        }
      ]
    })

    const response = result.response
    const text = await response.text()

    res.json({ answer: text })
  } catch (error) {
    console.error('Gemini error:', error)
    res.status(500).json({ error: 'Something went wrong with AI.' })
  }
})

// --- Auth Routes ---
app.use('/api/auth', auth)
app.use('/api/user', wizard)
app.use("/api/analysis", analysisRoutes)
app.use("/api/upload", uploadRoutes)
app.use('/api/explain', explainRoute);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
