import User from "../models/User.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeUserPortfolio(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.wizardData) {
      return res.status(404).json({ message: "User or wizard data not found" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a financial advisor with expertise in Indian finance. Analyze the following user's financial and investment profile and return a JSON object with the following details:

- "riskLevel": (Low, Moderate, High)
- "investmentDistribution": an object with asset types (e.g., "Equity Mutual Funds", "Fixed Deposits", "Public Provident Fund (PPF)", "National Pension Scheme (NPS)", "Real Estate", etc.) as keys and the corresponding percentage allocation as values.
- "insights": 3-5 personalized insights based on the user's financial situation, considering aspects such as retirement planning, tax-saving options (e.g., 80C, NPS), and risk diversification.
- "nextSteps": 3 action-oriented next steps to improve their financial situation, such as rebalancing their portfolio, increasing emergency savings, or investing in tax-saving instruments.

Ensure to provide investment suggestions specific to the Indian market, including options like Mutual Funds (ELSS), NPS, and other popular Indian investment vehicles.

Respond ONLY with a JSON object, with no additional text.


User Data:
${JSON.stringify(user.wizardData, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    let response = result.response.text();

    // Clean up the response to remove backticks and any surrounding text
    response = response.replace(/```(json)?/g, '').trim();

    try {
      const parsed = JSON.parse(response);
      res.json(parsed);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Failed JSON string:", response);
      return res.status(500).json({
        message: "Failed to parse AI response",
        error: parseError.message,
      });
    }
  } catch (error) {
    console.error("Analysis error:", error);

    if (
      error.status === 400 &&
      error.errorDetails?.[0]?.reason === "API_KEY_INVALID"
    ) {
      return res.status(400).json({
        message: "Invalid API key. Please check your configuration.",
      });
    }

    res.status(500).json({
      message: "Failed to analyze portfolio",
      error: error.message,
    });
  }
}