import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { AlertTriangle, TrendingUp, Shield, BarChart3 } from 'lucide-react'

type InvestmentDistribution = {
  [key: string]: number
}

interface AnalysisData {
  riskLevel: "Low" | "Moderate" | "High"
  investmentDistribution: InvestmentDistribution
  insights: string[]
  nextSteps: string[]
}

// Teal/Emerald color palette
const COLORS = ["#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a", "#10b981", "#059669", "#047857", "#065f46", "#064e3b"]

export default function PortfolioInsights({ analysisData }: { analysisData: AnalysisData | null }) {
  if (!analysisData) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-pulse flex flex-col items-center">
        <div className="rounded-full bg-teal-200 dark:bg-teal-800 h-12 w-12 mb-4"></div>
        <div className="h-4 bg-teal-200 dark:bg-teal-800 rounded w-24 mb-3"></div>
        <div className="h-3 bg-teal-100 dark:bg-teal-900 rounded w-32"></div>
      </div>
    </div>
  )

  const { riskLevel, investmentDistribution, insights, nextSteps } = analysisData

  const chartData = Object.entries(investmentDistribution || {}).map(([name, value]) => ({
    name,
    value,
  }))

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-red-600 dark:text-red-400"
      case "Moderate":
        return "text-amber-600 dark:text-amber-400"
      case "Low":
        return "text-teal-600 dark:text-teal-400"
      default:
        return "text-teal-600 dark:text-teal-400"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2 mt-6">
            <Shield className="h-5 w-5" />
            Risk Level
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className={`text-2xl font-bold ${getRiskColor(riskLevel)}`}>
              {riskLevel}
            </div>
            <div className="ml-4 flex-1">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className={`h-2 rounded-full ${
                    riskLevel === "High" 
                      ? "bg-red-500 dark:bg-red-600" 
                      : riskLevel === "Moderate" 
                        ? "bg-amber-500 dark:bg-amber-600" 
                        : "bg-teal-500 dark:bg-teal-600"
                  }`}
                  style={{ 
                    width: riskLevel === "High" 
                      ? "90%" 
                      : riskLevel === "Moderate" 
                        ? "60%" 
                        : "30%" 
                  }}
                ></div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            {riskLevel === "High" 
              ? "Your portfolio has a high risk level. Consider diversifying to reduce volatility." 
              : riskLevel === "Moderate" 
                ? "Your portfolio has a balanced risk level, suitable for moderate growth." 
                : "Your portfolio has a conservative risk level, prioritizing capital preservation."}
          </p>
        </CardContent>
      </Card>

      <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2 mt-6">
            <BarChart3 className="h-5 w-5" />
            Investment Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 flex justify-center">
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie 
                  data={chartData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  label
                >
                    {chartData.map((entry, index) => {
                    console.log(entry); // Logging the entry to use it in the code
                    return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                    })}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full border-teal-100 dark:border-teal-900/50 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2 mt-6">
            <TrendingUp className="h-5 w-5" />
            Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-2">
            {insights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 rounded-md bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50">
                <div className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                  <span className="text-teal-600 dark:text-teal-400 text-xs font-bold">{idx + 1}</span>
                </div>
                <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="col-span-full border-teal-100 dark:border-teal-900/50 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2 mt-6">
            <AlertTriangle className="h-5 w-5" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-2">
            {nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 rounded-md bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50">
                <div className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                  <span className="text-teal-600 dark:text-teal-400 text-xs font-bold">{idx + 1}</span>
                </div>
                <span className="text-zinc-700 dark:text-zinc-300">{step}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
