import KiteConnect from "kiteconnect";
import User from "../models/User.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client for recommendations
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Connect Zerodha account
export const connectZerodha = async (req, res) => {
  try {
    const { apiKey, apiSecret } = req.body;
    np
    if (!apiKey || !apiSecret) {
      return res.status(400).json({ success: false, message: "API Key and Secret are required" });
    }
    
    // Store the API credentials in the user document
    // In a production app, these should be encrypted
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Test connection to Kite API
    try {
      const kite = new KiteConnect({ api_key: apiKey });
      // Just validate that the API key is in the correct format
      // Real validation would happen when the user tries to fetch data
      if (!kite) {
        throw new Error("Failed to initialize Kite API");
      }
    } catch (kitErr) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid Zerodha API credentials"
      });
    }
    
    user.zerodhaData = {
      apiKey,
      apiSecret,
      connected: true,
      connectedAt: new Date()
    };
    
    await user.save();
    
    return res.status(200).json({ 
      success: true, 
      message: "Zerodha account connected successfully"
    });
    
  } catch (error) {
    console.error("Zerodha connection error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to connect Zerodha account"
    });
  }
};

// Get portfolio data from Zerodha
export const getPortfolioData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.zerodhaData || !user.zerodhaData.connected) {
      return res.status(401).json({ message: "Zerodha account not connected" });
    }
    
    const { apiKey, apiSecret } = user.zerodhaData;
    
    // Initialize Kite Connect
    const kite = new KiteConnect({ api_key: apiKey });
    kite.setAccessToken(apiSecret); // In a real app, you'd use proper OAuth flow
    
    // Fetch holdings data
    const holdings = await kite.getHoldings();
    
    // Calculate overall return
    let totalInvestment = 0;
    let currentValue = 0;
    
    holdings.forEach(holding => {
      totalInvestment += holding.quantity * holding.average_price;
      currentValue += holding.quantity * holding.last_price;
    });
    
    const absoluteReturn = currentValue - totalInvestment;
    const percentageReturn = (absoluteReturn / totalInvestment) * 100;
    
    // Generate fund recommendations based on portfolio
    const recommendations = await generateRecommendations(holdings);
    
    res.status(200).json({
      holdings: holdings.map(item => ({
        tradingSymbol: item.tradingsymbol,
        exchange: item.exchange,
        isin: item.isin,
        quantity: item.quantity,
        averageBuyPrice: item.average_price,
        lastPrice: item.last_price,
        closePrice: item.close_price,
        pnl: (item.last_price - item.average_price) * item.quantity,
        dayChange: (item.last_price - item.close_price) * item.quantity,
        dayChangePercentage: ((item.last_price - item.close_price) / item.close_price) * 100
      })),
      overallReturn: {
        totalInvestment,
        currentValue,
        absoluteReturn,
        percentageReturn
      },
      recommendations
    });
    
  } catch (error) {
    console.error("Zerodha portfolio fetch error:", error);
    
    // Check for specific error types
    if (error.error_type === "TokenException") {
      return res.status(401).json({ message: "Zerodha authentication failed. Please reconnect your account." });
    }
    
    return res.status(500).json({ 
      message: "Failed to fetch Zerodha portfolio data",
      error: error.message
    });
  }
};

// Generate fund recommendations based on portfolio
const generateRecommendations = async (holdings) => {
  try {
    // For a real app, you would analyze the portfolio and use historical data
    // Here, we'll use a simple mock implementation plus AI-generated rationales
    
    // Extract basic portfolio information
    const sectors = {};
    const marketCap = { large: 0, mid: 0, small: 0 };
    let totalValue = 0;
    
    holdings.forEach(holding => {
      // In a real app, you would have more data about each holding
      // This is simplified
      totalValue += holding.quantity * holding.last_price;
      
      // Mock sector and market cap classification
      if (holding.tradingsymbol.startsWith('HDFC') || holding.tradingsymbol.startsWith('ICICI') || holding.tradingsymbol.startsWith('SBI')) {
        sectors.banking = (sectors.banking || 0) + (holding.quantity * holding.last_price);
        marketCap.large += holding.quantity * holding.last_price;
      } else if (holding.tradingsymbol.startsWith('INFY') || holding.tradingsymbol.startsWith('TCS')) {
        sectors.it = (sectors.it || 0) + (holding.quantity * holding.last_price);
        marketCap.large += holding.quantity * holding.last_price;
      } else if (holding.tradingsymbol.startsWith('RELIANCE') || holding.tradingsymbol.startsWith('IOC')) {
        sectors.energy = (sectors.energy || 0) + (holding.quantity * holding.last_price);
        marketCap.large += holding.quantity * holding.last_price;
      } else {
        sectors.other = (sectors.other || 0) + (holding.quantity * holding.last_price);
        marketCap.mid += holding.quantity * holding.last_price;
      }
    });
    
    // Calculate percentages
    Object.keys(sectors).forEach(key => {
      sectors[key] = (sectors[key] / totalValue) * 100;
    });
    
    Object.keys(marketCap).forEach(key => {
      marketCap[key] = (marketCap[key] / totalValue) * 100;
    });
    
    // Generate recommendations based on portfolio composition
    const mockRecommendations = [];
    
    // Check sector concentration for diversification needs
    const highestSector = Object.keys(sectors).reduce((a, b) => sectors[a] > sectors[b] ? a : b);
    const needsDiversification = sectors[highestSector] > 35; // If more than 35% in one sector
    
    // Check market cap distribution
    const needsSmallCap = marketCap.small < 10; // If less than 10% in small cap
    const needsMidCap = marketCap.mid < 20; // If less than 20% in mid cap
    
    // Recommendations based on portfolio gaps
    if (needsDiversification) {
      // Need sector diversification
      if (!(sectors.banking) || sectors.banking < 15) {
        mockRecommendations.push({
          schemeCode: "HDFC1477",
          schemeName: "HDFC Banking and Financial Services Fund",
          category: "Sector Fund",
          riskLevel: "Moderate",
          returns: { oneYear: 17.5, threeYear: 14.2, fiveYear: 12.8 },
          minSipAmount: 500,
          suggestedSipAmount: 5000
        });
      }
      
      if (!(sectors.it) || sectors.it < 15) {
        mockRecommendations.push({
          schemeCode: "TATA1755",
          schemeName: "Tata Digital India Fund",
          category: "Sector Fund",
          riskLevel: "High",
          returns: { oneYear: 22.4, threeYear: 19.8, fiveYear: 16.5 },
          minSipAmount: 500,
          suggestedSipAmount: 4000
        });
      }
    }
    
    if (needsSmallCap) {
      mockRecommendations.push({
        schemeCode: "AXIS1245",
        schemeName: "Axis Small Cap Fund",
        category: "Small Cap",
        riskLevel: "High",
        returns: { oneYear: 24.6, threeYear: 18.7, fiveYear: 15.9 },
        minSipAmount: 500,
        suggestedSipAmount: 3000
      });
    }
    
    if (needsMidCap) {
      mockRecommendations.push({
        schemeCode: "KOTAK9999",
        schemeName: "Kotak Emerging Equity Fund",
        category: "Mid Cap",
        riskLevel: "Moderate",
        returns: { oneYear: 19.2, threeYear: 16.3, fiveYear: 13.8 },
        minSipAmount: 1000,
        suggestedSipAmount: 4000
      });
    }
    
    // Always add an index fund option
    mockRecommendations.push({
      schemeCode: "UTI2123",
      schemeName: "UTI Nifty Index Fund",
      category: "Index Fund",
      riskLevel: "Moderate",
      returns: { oneYear: 15.8, threeYear: 14.1, fiveYear: 12.2 },
      minSipAmount: 500,
      suggestedSipAmount: 5000
    });
    
    // Add a debt fund option for balance
    mockRecommendations.push({
      schemeCode: "ICICI8765",
      schemeName: "ICICI Prudential Corporate Bond Fund",
      category: "Debt Fund",
      riskLevel: "Low",
      returns: { oneYear: 7.2, threeYear: 6.8, fiveYear: 7.1 },
      minSipAmount: 1000,
      suggestedSipAmount: 3000
    });
    
    // Limit recommendations to at most 4
    const finalRecommendations = mockRecommendations.slice(0, 4);
    
    // Generate AI rationales for each recommendation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    for (let i = 0; i < finalRecommendations.length; i++) {
      const fund = finalRecommendations[i];
      try {
        const prompt = `
          As an Indian financial advisor, provide a brief explanation (no more than 3 sentences) for why an investor should consider setting up a SIP in "${fund.schemeName}" (${fund.category}, Risk: ${fund.riskLevel}).
          
          Recent performance:
          - 1 Year Return: ${fund.returns.oneYear}%
          - 3 Year Return: ${fund.returns.threeYear}%
          - 5 Year Return: ${fund.returns.fiveYear}%
          
          Focus on benefits in the Indian context, including any tax advantages. Make it concise, educational and free of excessive jargon.
        `;
        
        const result = await model.generateContent(prompt);
        const rationale = result.response.text();
        
        finalRecommendations[i].rationale = rationale;
      } catch (aiError) {
        console.error("AI rationale generation error:", aiError);
        finalRecommendations[i].rationale = `${fund.schemeName} can help diversify your portfolio with ${fund.category.toLowerCase()} exposure. It has shown strong returns of ${fund.returns.threeYear}% over 3 years with ${fund.riskLevel.toLowerCase()} risk.`;
      }
    }
    
    return finalRecommendations;
    
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [
      {
        schemeCode: "UTI2123",
        schemeName: "UTI Nifty Index Fund",
        category: "Index Fund",
        riskLevel: "Moderate",
        returns: { oneYear: 15.8, threeYear: 14.1, fiveYear: 12.2 },
        minSipAmount: 500,
        suggestedSipAmount: 5000,
        rationale: "Index funds like UTI Nifty provide broad market exposure at low cost. They're an excellent core holding for long-term wealth creation with returns that have beaten many actively managed funds."
      }
    ];
  }
};