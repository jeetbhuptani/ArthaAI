import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

type InvestmentDistribution = {
  [key: string]: number
}

interface AnalysisData {
  riskLevel: "Low" | "Moderate" | "High"
  investmentDistribution: InvestmentDistribution
  insights: string[]
  nextSteps: string[]
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#d0ed57"]

export default function PortfolioInsights({ analysisData }: { analysisData: AnalysisData | null }) {
  if (!analysisData) return <p className="p-4">Loading...</p>

  const { riskLevel, investmentDistribution, insights, nextSteps } = analysisData

  const chartData = Object.entries(investmentDistribution || {}).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Risk Level</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-lg font-bold ${
              riskLevel === "High"
                ? "text-red-600"
                : riskLevel === "Moderate"
                ? "text-yellow-500"
                : "text-green-600"
            }`}
          >
            {riskLevel}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investment Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <PieChart width={300} height={250}>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80} label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-1">
            {insights.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-1">
            {nextSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
