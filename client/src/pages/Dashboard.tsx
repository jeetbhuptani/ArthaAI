"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PortfolioInsights from "@/components/PortfolioInsights"
import { Loader2, PieChart } from "lucide-react"

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

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/analysis`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch analysis data")
        }

        const data: AnalysisData = await response.json()
        setAnalysis(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [])

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
      <Card className="border-teal-100 dark:border-teal-900/50 shadow-md mb-8">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="mt-6 text-2xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
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
    </div>
  )
}
