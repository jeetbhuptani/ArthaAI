import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';
config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
`;

export const askArthaAI = async (req, res) => {
  const { question } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent({
      contents: [
        {
          parts: [
            { text: `${SYSTEM_PROMPT}\n\nQ: ${question}\n\nA:` }
          ]
        }
      ]
    });

    const response = result.response;
    const text = await response.text();

    res.json({ answer: text });
  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: 'Something went wrong with AI.' });
  }
};