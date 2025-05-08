"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Trash2,
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  Save,
  Download,
  Database,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function LearningChat() {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<{ type: "user" | "bot"; text: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://mern-backend-166800957423.us-central1.run.app";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedConversations, setSavedConversations] = useState<
    { id: string; title: string }[]
  >([]);
  const [showSavedConversations, setShowSavedConversations] = useState(false);
  const [preferUserData, setPreferUserData] = useState(false);
  const speechActiveRef = useRef<boolean>(true); 
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.warn("Speech recognition not supported in this browser");
      return;
    }

    // Initialize SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-IN"; // Set to Indian English
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      // Small delay to let user see what was transcribed
      setTimeout(() => {
        sendQuestion(transcript);
      }, 500);
    };
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Get token from localStorage (assuming that's where your app stores it)
        const token = localStorage.getItem("auth_token");

        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        // Use the verify endpoint instead of status
        const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          await response.json();
          setIsAuthenticated(true);
          // You can also get user data if needed
          // const userData = data.user;
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to check authentication status:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, [API_BASE_URL]);

  useEffect(() => {
    // Handle voice loading
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // This event fires when voices are loaded and available
      const handleVoicesChanged = () => {
        const allVoices = window.speechSynthesis.getVoices();
        console.log("Available voices:", allVoices.map(v => `${v.name} (${v.lang})`));
      };
      
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      
      // Initial check for already loaded voices
      handleVoicesChanged();
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const sendQuestion = async (questionText: string = question) => {
    if (!questionText.trim() || isLoading) return;

    const userMessage = { type: "user" as const, text: questionText };
    setChat((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      // Get token if authenticated
      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add Authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Always send the request with the same structure, just toggle preferUserData flag
      const res = await fetch(`${API_BASE_URL}/api/ask`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          question: questionText,
          conversationId,
          history: chat,
          preferUserData: preferUserData, // This will be false when not toggled
        }),
        credentials: "include",
      });

      const data = await res.json();

      // Update conversation ID if one is returned from the backend
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const botResponse = { type: "bot" as const, text: data.answer };
      setChat((prev) => [...prev, botResponse]);

      // Speak the bot's response if speech is enabled
      if (speechEnabled) {
        // Convert markdown to plain text for speech
        const plainText = data.answer
          .replace(/\|.*?\|/g, "") // Remove table borders
          .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Convert links to just text
          .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markers
          .replace(/\*(.*?)\*/g, "$1") // Remove italic markers
          .replace(/#{1,6} (.*?)$/gm, "$1") // Remove heading markers
          .replace(/\n/g, " "); // Replace newlines with spaces

        speakText(plainText);
      }
    } catch (err) {
      console.error(err);
      setChat((prev) => [
        ...prev,
        { type: "bot", text: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendQuestion();
  };

  

  const resetChat = () => {
    setChat([]);
    setConversationId(null); // Clear the conversation ID
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const speakText = (text: string) => {
    if (!speechEnabled) return;
    speechActiveRef.current = true; 
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Clean text for speech synthesis
    let cleanedText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/```[\s\S]*?```/g, 'Code example omitted for speech.')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Break text into smaller chunks at sentence boundaries
    const sentenceBreaks = cleanedText.match(/[^.!?]+[.!?]+/g) || [];
    const chunks = sentenceBreaks.length > 0 ? sentenceBreaks : [cleanedText];
    
    // Store chunks and current index in component state/refs
    const speechQueue = [...chunks];
    let currentIndex = 0;
    
    // Keep track of all utterances to prevent garbage collection
    const utterances: SpeechSynthesisUtterance[] = [];
    
    // Set speaking state at start
    setIsSpeaking(true);
    
    // Get available voices
    let voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(voice => voice.lang === 'hi-IN');
    const indianEnglishVoice = voices.find(voice => voice.lang === 'en-IN');
    const britishVoice = voices.find(voice => voice.lang === 'en-GB');
    const femaleVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('Female') || voice.name.includes('female'))
    );
    const selectedVoice = hindiVoice || indianEnglishVoice || britishVoice || femaleVoice || voices[0];
    
    // Function to speak the next chunk
    const speakNextChunk = () => {
      if (currentIndex >= speechQueue.length) {
        setIsSpeaking(false);
        return;
      }
      
      const chunk = speechQueue[currentIndex];
      const utterance = new SpeechSynthesisUtterance(chunk);
      
      // Configure utterance
      utterance.voice = selectedVoice;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onend = () => {
        currentIndex++;
        
      if(!speechActiveRef.current || !speechEnabled) {
        setIsSpeaking(false);
        return;
      }
        // Small timeout before speaking next chunk to prevent Chrome bugs
        setTimeout(() => {
          if (speechEnabled) {
            speakNextChunk();
          }
        }, 50);
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error", event);
        setIsSpeaking(false);
      };
      
      // Store reference to prevent garbage collection
      utterances.push(utterance);
      speechSynthesisRef.current = utterance;
      
      // Speak the chunk
      window.speechSynthesis.speak(utterance);
    };
    
    // Start speaking
    speakNextChunk();
    
    // Return a function to cancel speech if needed
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (isSpeaking) {
      speechActiveRef.current = false; 
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const saveConversation = async () => {
    if (!isAuthenticated || !chat.length) return;

    setIsSaving(true);
    try {
      // Get authentication token
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Generate a title from the first user message
      const firstUserMessage =
        chat.find((msg) => msg.type === "user")?.text || "New Conversation";
      const title =
        firstUserMessage.length > 30
          ? firstUserMessage.substring(0, 30) + "..."
          : firstUserMessage;

      const response = await fetch(`${API_BASE_URL}/api/ask/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId,
          title,
          messages: chat,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversationId);
        alert("Conversation saved successfully!");
      } else {
        throw new Error("Failed to save conversation");
      }
    } catch (error) {
      console.error("Error saving conversation:", error);
      alert("Failed to save the conversation. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const loadSavedConversations = async () => {
    if (!isAuthenticated) return;

    try {
      // Get authentication token
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_BASE_URL}/api/ask/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setSavedConversations(data.conversations);
        setShowSavedConversations(true);
      }
    } catch (error) {
      console.error("Error loading saved conversations:", error);
      alert("Failed to load your saved conversations.");
    }
  };

  const loadConversation = async (id: string) => {
    try {
      // Get authentication token
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/ask/conversations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setChat(data.messages);
        setConversationId(id);
        setShowSavedConversations(false);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      alert("Failed to load the conversation.");
    }
  };

  const deleteConversation = async (id: string) => {
    if (!isAuthenticated) return;

    try {
      // Get authentication token
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/ask/conversations/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        // Remove the conversation from the list
        setSavedConversations((prev) =>
          prev.filter((convo) => convo.id !== id)
        );

        // If we're viewing the deleted conversation, reset the chat
        if (conversationId === id) {
          resetChat();
        }

        alert("Conversation deleted successfully!");
      } else {
        throw new Error("Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      alert("Failed to delete the conversation. Please try again.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4">
      <motion.header
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 p-6 rounded-xl shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">
            ArthaAI Financial Assistant
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Ask me anything about personal finance, investments, or money
            management
          </p>
        </div>
      </motion.header>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-emerald-50/50 dark:from-teal-900/10 dark:to-emerald-900/10 rounded-xl -z-10" />

        <div className="h-[500px] md:h-[600px] overflow-y-auto p-4 md:p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm shadow-md">
          {chat.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 dark:text-zinc-400 space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <Bot className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-xl font-medium text-zinc-800 dark:text-zinc-200">
                  Welcome to ArthaAI
                </h3>
                <p>
                  I can help you understand financial concepts, plan your
                  budget, or learn about investments. What would you like to
                  know?
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-md mt-4">
                {[
                  "How much to save monthly?",
                  "What is SIP?",
                  "Fixed deposit vs gold?",
                  "How to reduce EMI burden?",
                ].map((suggestion, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="text-left justify-start h-auto py-2 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                    onClick={() => {
                      setQuestion(suggestion);
                      setTimeout(() => {
                        sendQuestion();
                      }, 100);
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-4">
                {chat.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] ${
                        msg.type === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                          msg.type === "user"
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : "bg-teal-100 dark:bg-teal-900/30"
                        }`}
                      >
                        {msg.type === "user" ? (
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        )}
                      </div>
                      <Card
                        className={`w-fit ${
                          msg.type === "user"
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
                            : "bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-800"
                        }`}
                      >
                        <CardContent className="p-3 md:p-4 text-sm md:text-base">
                          {msg.type === "user" ? (
                            msg.text
                          ) : (
                            <div className="prose dark:prose-invert prose-sm max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.text}
                              </ReactMarkdown>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </AnimatePresence>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start mt-4"
            >
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-teal-100 dark:bg-teal-900/30">
                  <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <Card className="w-fit bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-800">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Input
          ref={inputRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask your financial question..."
          className="border-zinc-300 dark:border-zinc-700 focus-visible:ring-teal-500"
        />
        <Button
          onClick={() => sendQuestion()}
          disabled={isLoading || !question.trim()}
          className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
        >
          <Send className="w-4 h-4 mr-2" />
          Ask
        </Button>
        <Button
          variant="outline"
          onClick={toggleSpeech}
          className="px-3 border-zinc-300 dark:border-zinc-700"
          title={
            speechEnabled ? "Mute voice responses" : "Enable voice responses"
          }
        >
          {speechEnabled ? (
            <Volume2
              className={`w-4 h-4 ${
                isSpeaking ? "text-teal-600 dark:text-teal-400" : ""
              }`}
            />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>
        {isAuthenticated && (
          <Button
            variant="outline"
            onClick={() => setPreferUserData(!preferUserData)}
            className={`px-3 border-zinc-300 dark:border-zinc-700 ${
              preferUserData ? "bg-teal-100 dark:bg-teal-900/30" : ""
            }`}
            title="Prefer User Data"
          >
            <Database
              className={`w-4 h-4 ${
                preferUserData
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            />
          </Button>
        )}
        {/* Save button - only shown if authenticated and chat has messages */}
        {isAuthenticated && chat.length > 0 && (
          <Button
            variant="outline"
            onClick={saveConversation}
            disabled={isSaving}
            className="px-3 border-zinc-300 dark:border-zinc-700"
            title="Save conversation"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" />
            ) : (
              <Save className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            )}
          </Button>
        )}

        {/* Show saved conversations button - only if authenticated */}
        {isAuthenticated && (
          <Button
            variant="outline"
            onClick={loadSavedConversations}
            className="px-3 border-zinc-300 dark:border-zinc-700"
            title="View saved conversations"
          >
            <Download className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </Button>
        )}

        <Button
          variant="outline"
          onClick={resetChat}
          className="px-3 border-zinc-300 dark:border-zinc-700"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </Button>
      </div>

      {/* Modal for saved conversations */}
      {showSavedConversations && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Saved Conversations</h3>

            {savedConversations.length === 0 ? (
              <p className="text-zinc-500 dark:text-zinc-400">
                No saved conversations found.
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {savedConversations.map((convo) => (
                  <div
                    key={convo.id}
                    className="flex items-center justify-between border border-zinc-200 dark:border-zinc-700 rounded-lg p-2"
                  >
                    <Button
                      variant="ghost"
                      className="justify-start text-left py-2 mr-2"
                      onClick={() => loadConversation(convo.id)}
                    >
                      {convo.title}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => deleteConversation(convo.id)}
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowSavedConversations(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-4">
        ArthaAI learning is designed to provide general financial information,
        not personalized financial advice.
      </div>
    </div>
  );
}

export default LearningChat;
