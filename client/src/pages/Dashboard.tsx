import { useEffect, useState } from "react";
import PortfolioInsights from "@/components/PortfolioInsights";

// Define the shape of the data returned from the backend
interface AnalysisData {
  riskLevel: "Low" | "Moderate" | "High";
  investmentDistribution: Record<string, number>; // e.g., { "Mutual Funds": 60, "FD": 40 }
  insights: string[];
  nextSteps: string[];
}

export default function Dashboard() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/analysis`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analysis data");
        }

        const data: AnalysisData = await response.json();
        setAnalysis(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) return <div className="p-4">Loading portfolio analysis...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!analysis) return <div className="p-4">No analysis data available</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Portfolio Analysis</h1>
      <PortfolioInsights analysisData={analysis} />
    </div>
  );
}
