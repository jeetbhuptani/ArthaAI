import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Link } from "lucide-react";
import axios from "axios";

export default function ZerodhaConnect() {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleConnect = async () => {
    if (!apiKey || !apiSecret) {
      setError("Please provide both API Key and API Secret");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/zerodha/connect`,
        { apiKey, apiSecret },
        { withCredentials: true }
      );

      if (response.data.success) {
        setConnected(true);
        localStorage.setItem("zerodha_connected", "true");
      } else {
        setError(response.data.message || "Failed to connect to Zerodha");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred connecting to Zerodha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
        <CardTitle className="text-2xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
          <Link className="h-6 w-6" />
          Connect Zerodha Account
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {connected ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Successfully Connected!</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Your Zerodha account is now linked with ArthaAI for portfolio analysis.
            </p>
            <Button variant="outline" onClick={() => setConnected(false)}>
              Disconnect Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-zinc-600 dark:text-zinc-400">
              Connect your Zerodha account to view your portfolio, analyze performance, and get personalized recommendations.
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4 flex gap-3">
              <AlertCircle className="text-amber-500 h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 dark:text-amber-300 text-sm">
                  ArthaAI only analyzes your portfolio data. We don't store your API credentials or make any transactions on your behalf.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="api-key" className="text-base">
                API Key
              </Label>
              <Input
                id="api-key"
                type="text"
                placeholder="Enter your Zerodha API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="border-zinc-300 dark:border-zinc-700"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="api-secret" className="text-base">
                API Secret
              </Label>
              <Input
                id="api-secret"
                type="password"
                placeholder="Enter your API secret"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                className="border-zinc-300 dark:border-zinc-700"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="pt-2">
              <Button 
                onClick={handleConnect} 
                disabled={loading} 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                {loading ? "Connecting..." : "Connect Zerodha Account"}
              </Button>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2">
              Don't have API keys? <a href="https://kite.zerodha.com/settings/api" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Get them from Zerodha</a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}