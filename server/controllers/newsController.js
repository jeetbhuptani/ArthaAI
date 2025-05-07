import axios from "axios";
import NodeCache from "node-cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY2);
// Cache news data for 15 minutes to avoid hitting API limits
const newsCache = new NodeCache({ stdTTL: 900 });

export const getFinanceNews = async (req, res) => {
  try {
    // Check cache first
    const cachedNews = newsCache.get("india_finance_news");
    if (cachedNews) {
      return res.json(cachedNews);
    }

    // If not in cache, fetch from NewsAPI
    // const response = await axios.get("https://newsapi.org/v2/top-headlines", {
    //   params: {
    //     // country: "in",
    //     category: "business",
    //     apiKey: process.env.NEWS_API_KEY,
    //   },
    // });
    const response = await axios.get("https://api.worldnewsapi.com/search-news", {
      params: {
        "source-country": "in",
        categories: "business",
        "api-key": process.env.WORLD_NEWS_API_KEY,
      },
    });
    console.log("Fetched news from API:", response.data);
    // Store in cache
    newsCache.set("india_finance_news", response.data);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching finance news:", error);
    res.status(500).json({ error: "Failed to fetch finance news" });
  }
};

export const summarizeText = async (req, res) => {
  try {
    const { text, title } = req.body;

    if (!text || text.length < 10) {
      return res.status(400).json({
        error: "Text is too short to summarize",
        summary: "Not enough content to generate a summary.",
      });
    }

    // Create a prompt for the AI
    const prompt = `
        Please provide a simple, easy-to-understand summary of the following financial news article.
        Explain any complex financial terms in simple language.
        Focus on the key points and how this news might impact average people in India.
        Keep the summary concise (3-4 sentences).
        
        Article Title: ${title}
        
        Article Content: ${text}
      `;

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({ summary: response.text() });
  } catch (error) {
    console.error("Error generating AI summary:", error);
    res.status(500).json({
      error: "Failed to generate summary",
      summary: "Unable to generate a summary at this time.",
    });
  }
};
