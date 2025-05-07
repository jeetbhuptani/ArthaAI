import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { verifyToken } from "../utils/jwtHelper.js";
config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define MongoDB Schema and Model (add this near the top of your file or in a separate models file)
const conversationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  messages: [
    {
      type: { type: String, enum: ["user", "bot"], required: true },
      text: { type: String, required: true },
    },
  ],
  saved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create indexes for efficient queries
conversationSchema.index({ userId: 1, saved: 1 });

// Create or get the model
const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

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

// Helper function to format conversations for Gemini's context
const formatChatHistory = (history) => {
  if (!history || history.length === 0) return "";

  return history
    .map((msg) => {
      const role = msg.type === "user" ? "Q" : "A";
      return `${role}: ${msg.text}\n\n`;
    })
    .join("");
};

// Main chat function with conversation history
export const askArthaAI = async (req, res) => {
  const {
    question,
    history = [],
    conversationId,
    preferUserData = false,
  } = req.body;

  // Log request details for debugging
  console.log("Request received:", {
    question: question.substring(0, 30) + "...",
    historyLength: history.length,
    preferUserData,
    authenticated: !!req.user,
  });
  let userId;
  let user;
  let userContext = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Get token from header
    const token = req.headers.authorization.split(" ")[1];
    try {
      // Verify token (ensure verifyToken is properly imported)
      const decoded = verifyToken(token);

      // Fetch user ID from decoded token
      userId = decoded.id;

      // Fetch user data if preferUserData is true
      if (userId && preferUserData) {
        user = await mongoose.model("User").findById(userId);

        console.log(
          "User found:",
          !!user,
          "Has wizard data:",
          !!user?.wizardData
        );

        if (user?.wizardData) {
          // Format user data for the AI prompt with clearer instruction
          userContext = `
\nIMPORTANT - USER FINANCIAL PROFILE:
The user has shared their financial details below. Use this information to personalize your advice:
- Age: ${user.wizardData.age || "Unknown"}
- Monthly Income: ₹${user.wizardData.monthly_income || "Unknown"}
- Investment Experience: ${
            user.wizardData.investment_experience_years || "Unknown"
          } years
- Risk Tolerance (self-reported): ${
            user.wizardData.risk_tolerance_self_reported || "Unknown"
          }/10
- Financial Goals: ${JSON.stringify(user.wizardData.financialGoals || [])}
- Tax Bracket: ${user.wizardData.tax_bracket || "Unknown"}
- Life Stage: ${user.wizardData.life_stage || "Unknown"}

YOU MUST reference this information when providing financial advice.
`;
        }
      }
    } catch (error) {
      console.error("Token verification or user fetching failed:", error);
      return res.status(401).json({ error: "Invalid token or user not found" });
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct prompt with history if available and user context if requested
    const chatHistory = formatChatHistory(history);
    // Make the userContext more prominent in the prompt
    const prompt = `${SYSTEM_PROMPT}${userContext}\n\n${chatHistory}Q: ${question}\n\nA:`;

    // Log just the structure of the prompt for debugging but not the full content
    console.log("Prompt structure:", {
      hasSystemPrompt: SYSTEM_PROMPT.length > 0,
      hasUserContext: userContext.length > 0,
      hasChatHistory: chatHistory.length > 0,
      questionLength: question.length,
    });

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const response = result.response;
    const text = await response.text();

    // Generate a new conversation ID if one doesn't exist
    const newConversationId = conversationId || uuidv4();

    // Save to MongoDB if user is authenticated
    if (userId) {
      const timestamp = new Date();
      const newMessages = [
        ...history,
        { type: "user", text: question },
        { type: "bot", text: text },
      ];

      // If this is an existing conversation, update it
      if (conversationId) {
        await Conversation.findOneAndUpdate(
          { id: conversationId, userId },
          {
            messages: newMessages,
            updatedAt: timestamp,
          }
        );
      }
      // Otherwise create a new conversation
      else {
        // Extract a title from the first message
        const title =
          question.length > 30 ? question.substring(0, 30) + "..." : question;

        await Conversation.create({
          id: newConversationId,
          userId,
          title,
          messages: newMessages,
          saved: false, // Initially not saved until user explicitly saves it
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }
    }

    res.json({
      answer: text,
      conversationId: newConversationId,
    });
  } catch (error) {
    console.error("AI or DB error:", error);
    res.status(500).json({ error: "Something went wrong with the service." });
  }
};

// Save a conversation (mark it as saved)
export const saveConversation = async (req, res) => {
  const { conversationId, title, messages } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const timestamp = new Date();
    const newConversationId = conversationId || uuidv4();

    // Log info for debugging
    console.log(
      `Saving conversation: ID=${newConversationId}, userId=${userId}`
    );

    // Check if the conversation exists first
    if (conversationId) {
      const existingConversation = await Conversation.findOne({
        id: conversationId,
      });
      console.log(
        "Existing conversation:",
        existingConversation ? "found" : "not found"
      );

      // If it exists but doesn't belong to this user, we'll create a new one
      if (existingConversation && existingConversation.userId !== userId) {
        console.log(
          "Creating new conversation because existing belongs to different user"
        );
        // Fall through to create new conversation
      }
      // If it exists and belongs to this user, update it
      else if (existingConversation) {
        const updatedConversation = await Conversation.findOneAndUpdate(
          { id: conversationId },
          {
            saved: true,
            title,
            messages, // Include messages in the update - this was missing
            updatedAt: timestamp,
          },
          { new: true }
        );

        console.log(
          "Updated conversation:",
          updatedConversation ? "success" : "failed"
        );

        if (updatedConversation) {
          return res.json({
            success: true,
            conversationId: updatedConversation.id,
          });
        }
      }
    }

    // If we reach here, either the conversation doesn't exist or we need to create a new one
    console.log("Creating new conversation");

    if (messages && messages.length > 0) {
      const newConversation = await Conversation.create({
        id: newConversationId,
        userId,
        title,
        messages,
        saved: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      console.log(
        "Created new conversation:",
        newConversation ? "success" : "failed"
      );

      return res.json({
        success: true,
        conversationId: newConversationId,
      });
    } else {
      return res
        .status(400)
        .json({ error: "No messages provided for new conversation" });
    }
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(500).json({ error: "Failed to save conversation" });
  }
};

// Get all saved conversations for a user
export const getSavedConversations = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const conversations = await Conversation.find(
      { userId, saved: true },
      { id: 1, title: 1, updatedAt: 1, _id: 0 }
    ).sort({ updatedAt: -1 });

    res.json({
      conversations: conversations.map((convo) => ({
        id: convo.id,
        title: convo.title,
        updatedAt: convo.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

// Get a specific conversation by ID
export const getConversation = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const conversation = await Conversation.findOne(
      { id, userId },
      { id: 1, title: 1, messages: 1, updatedAt: 1, _id: 0 }
    );

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({
      id: conversation.id,
      title: conversation.title,
      messages: conversation.messages,
      updatedAt: conversation.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};

export const deleteConversation = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    // Only delete if it belongs to this user
    const result = await Conversation.findOneAndDelete({ id, userId });

    if (!result) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({ success: true, message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
};
