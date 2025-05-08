import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ReturnData {
  totalInvestment: number;
  currentValue: number;
  absoluteReturn: number;
  percentageReturn: number;
}

interface ZerodhaReturnsProps {
  returnData: ReturnData;
}

export default function ZerodhaReturns({ returnData }: ZerodhaReturnsProps) {
  const { totalInvestment, currentValue, absoluteReturn, percentageReturn } = returnData;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const data = [
    { name: "Investment", value: totalInvestment },
    { name: "Profit", value: absoluteReturn > 0 ? absoluteReturn : 0 },
  ];

  const COLORS = ["#0d9488", "#10b981"];

  return (
    <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
        <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Investment vs Returns
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Investment</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(totalInvestment)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Current Value</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(currentValue)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Absolute Return</p>
              <p className={`text-2xl font-bold ${absoluteReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                {absoluteReturn >= 0 ? "+" : ""}{formatCurrency(absoluteReturn)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Percentage Return</p>
              <p className={`text-2xl font-bold ${percentageReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                {percentageReturn >= 0 ? "+" : ""}{percentageReturn.toFixed(2)}%
              </p>
            </div>
          </div>
          
          <div className="h-[250px] flex items-center justify-center">
            {absoluteReturn > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center p-8 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-100 dark:border-amber-800">
                <TrendingUp className="h-12 w-12 mx-auto text-amber-500 mb-2" />
                <p className="text-amber-800 dark:text-amber-300 font-medium">
                  Your investments are currently in the red.
                </p>
                <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">
                  Consider a long-term strategy and regular SIPs to average your costs.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}