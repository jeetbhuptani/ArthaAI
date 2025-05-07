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
You are an expert financial advisor specializing in Indian personal finance and investments. Analyze the following user's financial profile and return a JSON object that follows the exact structure specified below.

USER PROFILE ANALYSIS REQUIREMENTS:
1. Determine the appropriate risk level based on age, income, experience, self-reported tolerance, and life stage.
2. Create an investment distribution optimized for their goals, timeline, and risk profile.
3. Generate personalized insights addressing their specific financial situation.
4. Provide actionable next steps relevant to Indian investors.

OUTPUT FORMAT:
{
  "riskLevel": "Low" | "Moderate" | "High",
  "investmentDistribution": {
    "Equity Mutual Funds": number,
    "Debt Mutual Funds": number,
    "Gold": number,
    "Fixed Deposits": number,
    // Include other appropriate Indian investment vehicles
    // All percentages should add up to 100
  },
  "insights": [
    "Insight 1",
    "Insight 2",
    "Insight 3",
    // 3-5 personalized insights
  ],
  "nextSteps": [
    "Action 1",
    "Action 2",
    "Action 3"
  ]
}

INDIAN FINANCE CONTEXT:
- Consider tax-saving instruments under Section 80C (ELSS, PPF, NPS)
- Include market-appropriate vehicles like sovereign gold bonds, RBI bonds
- Consider debt options like corporate FDs and government schemes
- Factor in the user's tax bracket (${user.wizardData.tax_bracket || "Unknown"})

USER SPECIFIC CONSIDERATIONS:
- Age: ${user.wizardData.age} (${user.wizardData.life_stage} life stage)
- Goals: ${JSON.stringify(user.wizardData.financialGoals || [])}
- Risk tolerance: ${user.wizardData.risk_tolerance_self_reported || "Unknown"}/10
- Investment horizon: ${user.wizardData.investment_horizon_years || "Unknown"} years
- Emergency fund: ₹${user.wizardData.emergency_fund || 0} (${user.wizardData.emergency_fund_months || 0} months)
- Monthly income: ₹${user.wizardData.monthly_income || 0}
- Investment capacity: ₹${user.wizardData.investment_capacity || 0}
- Existing investments: ₹${user.wizardData.existing_investments || 0}
- Financial concerns: ${JSON.stringify(user.wizardData.financialConcerns || [])}

IMPORTANT: Respond ONLY with a valid JSON object matching the structure above. No preamble, explanation, or markdown formatting.
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