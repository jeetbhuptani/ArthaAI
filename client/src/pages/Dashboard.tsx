"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PortfolioInsights from "@/components/PortfolioInsights"
import { Loader2, PieChart } from "lucide-react"
import ZerodhaPortfolio from "@/components/Zerodha/ZerodhaPortfolio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define the shape of the data returned from the backend
interface AnalysisData {
  riskLevel: "Low" | "Moderate" | "High"
  investmentDistribution: Record<string, number> // e.g., { "Mutual Funds": 60, "FD": 40 }
  insights: string[]
  nextSteps: string[]
}

export default function Dashboard() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/api/analysis`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio analysis')
        }

        const data = await response.json()
        setAnalysis(data)
        setError(null)
      } catch (err: any) {
        console.error('Error fetching portfolio analysis:', err)
        setError(err.message || 'Failed to load portfolio analysis')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [API_BASE_URL])

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-teal-600 dark:text-teal-400" />
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Loading portfolio analysis...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <Card className="border-red-100 dark:border-red-900/50 shadow-md">
        <CardContent className="pt-6">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    )

  if (!analysis)
    return (
      <Card className="border-amber-100 dark:border-amber-900/50 shadow-md">
        <CardContent className="pt-6">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-100 dark:border-amber-900/50 text-amber-600 dark:text-amber-400">
            No analysis data available. Please complete your financial profile to see insights.
          </div>
        </CardContent>
      </Card>
    )

  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue="portfolio" className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="portfolio">ArthaAI Analysis</TabsTrigger>
          <TabsTrigger value="zerodha">Zerodha Portfolio</TabsTrigger>
        </TabsList>
        <TabsContent value="portfolio" className="pt-4">
          <Card className="border-teal-100 dark:border-teal-900/50 shadow-md mb-8">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
              <CardTitle className="text-2xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
                <PieChart className="h-6 w-6" />
                Your Portfolio Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Based on your financial profile, we've analyzed your portfolio to provide insights and recommendations.
              </p>

              <PortfolioInsights analysisData={analysis} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="zerodha" className="pt-4">
          <ZerodhaPortfolio />
        </TabsContent>
      </Tabs>
    </div>
  )
}