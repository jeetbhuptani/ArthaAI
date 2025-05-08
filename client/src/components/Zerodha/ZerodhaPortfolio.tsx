import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Loader2, RefreshCw, TrendingUp } from "lucide-react";
import axios from "axios";
import ZerodhaConnect from "./ZerodhaConnect";
import ZerodhaHoldings from "./ZerodhaHoldings";
import ZerodhaReturns from "./ZerodhaReturns";
import ZerodhaRecommendations from "./ZerodhaRecommendations";

interface ZerodhaData {
  holdings: PortfolioHolding[];
  overallReturn: {
    totalInvestment: number;
    currentValue: number;
    absoluteReturn: number;
    percentageReturn: number;
  };
  recommendations: Recommendation[];
}

export interface PortfolioHolding {
  tradingSymbol: string;
  exchange: string;
  isin: string;
  quantity: number;
  averageBuyPrice: number;
  lastPrice: number;
  closePrice: number;
  pnl: number;
  dayChange: number;
  dayChangePercentage: number;
}

export interface Recommendation {
  schemeCode: string;
  schemeName: string;
  category: string;
  riskLevel: string;
  returns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  minSipAmount: number;
  suggestedSipAmount: number;
  rationale: string;
}

export default function ZerodhaPortfolio() {
  const [isConnected, setIsConnected] = useState(false);
  const [portfolioData, setPortfolioData] = useState<ZerodhaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const connected = localStorage.getItem("zerodha_connected") === "true";
    setIsConnected(connected);
    
    if (connected) {
      fetchPortfolioData();
    }
  }, []);

  const fetchPortfolioData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/zerodha/portfolio`,
        { withCredentials: true }
      );
      
      setPortfolioData(response.data);
    } catch (err: any) {
      console.error("Failed to fetch portfolio data:", err);
      setError(err.response?.data?.message || "Failed to load portfolio data");
      
      // If unauthorized, clear connection status
      if (err.response?.status === 401) {
        localStorage.removeItem("zerodha_connected");
        setIsConnected(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <ZerodhaConnect />;
  }

  if (loading) {
    return (
      <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
        <CardContent className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 dark:text-teal-400 mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400">Loading your Zerodha portfolio...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-100 dark:border-red-900/50 shadow-md">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={fetchPortfolioData}>Retry</Button>
            <Button variant="outline" className="ml-2" onClick={() => setIsConnected(false)}>
              Reconnect Account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300">Your Zerodha Portfolio</h2>
        <Button variant="outline" size="sm" onClick={fetchPortfolioData} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Zerodha Holdings */}
      {portfolioData && <ZerodhaHoldings holdings={portfolioData.holdings} />}

      {/* Investment vs Return */}
      {portfolioData && <ZerodhaReturns returnData={portfolioData.overallReturn} />}

      {/* SIP Recommendations */}
      {portfolioData && <ZerodhaRecommendations recommendations={portfolioData.recommendations} />}
    </div>
  );
}