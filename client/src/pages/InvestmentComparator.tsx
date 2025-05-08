// Frontend: src/components/InvestmentComparator.tsx
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Award, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";

// Investment types for Indian market
const investmentTypes = {
  STOCKS_NIFTY50: "nifty50",
  STOCKS_SENSEX: "sensex",
  MUTUAL_FUNDS_EQUITY: "equityMF",
  MUTUAL_FUNDS_DEBT: "debtMF",
  MUTUAL_FUNDS_HYBRID: "hybridMF",
  REAL_ESTATE: "realEstate",
  FIXED_DEPOSIT: "fixedDeposit",
  GOLD: "gold",
  PPF: "ppf",
  NPS: "nps",
};

// Risk levels (1-10)
const riskLevels = {
  [investmentTypes.STOCKS_NIFTY50]: 8,
  [investmentTypes.STOCKS_SENSEX]: 7,
  [investmentTypes.MUTUAL_FUNDS_EQUITY]: 7,
  [investmentTypes.MUTUAL_FUNDS_DEBT]: 3,
  [investmentTypes.MUTUAL_FUNDS_HYBRID]: 5,
  [investmentTypes.REAL_ESTATE]: 6,
  [investmentTypes.FIXED_DEPOSIT]: 1,
  [investmentTypes.GOLD]: 4,
  [investmentTypes.PPF]: 2,
  [investmentTypes.NPS]: 4,
};

// Investment type names for display
const investmentTypeNames = {
  [investmentTypes.STOCKS_NIFTY50]: "Stocks (Nifty 50)",
  [investmentTypes.STOCKS_SENSEX]: "Stocks (Sensex)",
  [investmentTypes.MUTUAL_FUNDS_EQUITY]: "Equity Mutual Funds",
  [investmentTypes.MUTUAL_FUNDS_DEBT]: "Debt Mutual Funds",
  [investmentTypes.MUTUAL_FUNDS_HYBRID]: "Hybrid Mutual Funds",
  [investmentTypes.REAL_ESTATE]: "Real Estate",
  [investmentTypes.FIXED_DEPOSIT]: "Fixed Deposit",
  [investmentTypes.GOLD]: "Gold",
  [investmentTypes.PPF]: "Public Provident Fund (PPF)",
  [investmentTypes.NPS]: "National Pension System (NPS)",
};

// Chart colors
const chartColors = {
  [investmentTypes.STOCKS_NIFTY50]: "#14b8a6", // teal-500
  [investmentTypes.STOCKS_SENSEX]: "#0d9488", // teal-600
  [investmentTypes.MUTUAL_FUNDS_EQUITY]: "#0f766e", // teal-700
  [investmentTypes.MUTUAL_FUNDS_DEBT]: "#10b981", // emerald-500
  [investmentTypes.MUTUAL_FUNDS_HYBRID]: "#059669", // emerald-600
  [investmentTypes.REAL_ESTATE]: "#047857", // emerald-700
  [investmentTypes.FIXED_DEPOSIT]: "#0d9488", // teal-600
  [investmentTypes.GOLD]: "#115e59", // teal-800
  [investmentTypes.PPF]: "#065f46", // emerald-800
  [investmentTypes.NPS]: "#134e4a", // teal-900
};
// Calculate compound interest
const calculateCompoundInterest = (
  principal: number,
  rate: number,
  time: number,
  compoundingFrequency: number = 1
) => {
  const r = rate / 100;
  const n = compoundingFrequency;
  const t = time;
  return principal * Math.pow(1 + r / n, n * t);
};

// Calculate values for each year
const calculateYearlyValues = (
  principal: number,
  rate: number,
  years: number,
  compoundingFrequency: number = 1
) => {
  const yearlyData = [];

  for (let i = 0; i <= years; i++) {
    const value = calculateCompoundInterest(
      principal,
      rate,
      i,
      compoundingFrequency
    );
    yearlyData.push({
      year: i,
      value: Math.round(value),
    });
  }

  return yearlyData;
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

// Tax implications for different investment types (simplified)
const taxImplications = {
  [investmentTypes.STOCKS_NIFTY50]:
    "Long-term capital gains (>1 year) taxed at 10% above ₹1 lakh. Short-term gains taxed as per income slab.",
  [investmentTypes.STOCKS_SENSEX]:
    "Long-term capital gains (>1 year) taxed at 10% above ₹1 lakh. Short-term gains taxed as per income slab.",
  [investmentTypes.MUTUAL_FUNDS_EQUITY]:
    "Long-term capital gains (>1 year) taxed at 10% above ₹1 lakh. Short-term gains taxed at 15%.",
  [investmentTypes.MUTUAL_FUNDS_DEBT]:
    "Long-term capital gains (>3 years) taxed at 20% with indexation. Short-term gains taxed as per income slab.",
  [investmentTypes.MUTUAL_FUNDS_HYBRID]:
    "Taxation depends on equity-debt allocation. Generally, >65% equity follows equity taxation rules.",
  [investmentTypes.REAL_ESTATE]:
    "Long-term capital gains (>2 years) taxed at 20% with indexation benefits. Short-term gains as per income slab.",
  [investmentTypes.FIXED_DEPOSIT]:
    "Interest earned is fully taxable as per income slab. TDS applicable if interest exceeds ₹40,000 (₹50,000 for senior citizens).",
  [investmentTypes.GOLD]:
    "Physical gold: Long-term capital gains (>3 years) taxed at 20% with indexation. Gold ETFs/Funds follow same rules as physical gold.",
  [investmentTypes.PPF]:
    "Interest earned and maturity amount is completely tax-free. Eligible for tax deduction under Section 80C.",
  [investmentTypes.NPS]:
    "Tax deduction up to ₹1.5 lakh under Sec 80C and additional ₹50,000 under Sec 80CCD(1B). Partial tax benefits on maturity.",
};

// Investment liquidity ratings (1-10, where 10 is most liquid)
const liquidityRatings = {
  [investmentTypes.STOCKS_NIFTY50]: 9,
  [investmentTypes.STOCKS_SENSEX]: 9,
  [investmentTypes.MUTUAL_FUNDS_EQUITY]: 8,
  [investmentTypes.MUTUAL_FUNDS_DEBT]: 7,
  [investmentTypes.MUTUAL_FUNDS_HYBRID]: 7,
  [investmentTypes.REAL_ESTATE]: 3,
  [investmentTypes.FIXED_DEPOSIT]: 5, // Penalties on early withdrawal
  [investmentTypes.GOLD]: 7,
  [investmentTypes.PPF]: 4, // Restrictions on withdrawals
  [investmentTypes.NPS]: 2, // Locked until retirement with few exceptions
};

// Types for TypeScript
interface InvestmentResult {
  type: string;
  initialInvestment: number;
  rate: number;
  risk: number;
  duration: number;
  finalValue: number;
  profit: number;
  yearlyData: { year: number; value: number }[];
  liquidity: number;
  taxImplication: string;
  summary?: string;
}

interface ChartDataPoint {
  year: number;
  [key: string]: number;
}

interface RealTimeRates {
  [key: string]: number;
}

// Main component
export default function InvestmentComparator() {
  // State management
  const [initialInvestment, setInitialInvestment] = useState<number>(100000);
  const [duration, setDuration] = useState<number>(10);
  const [riskTolerance, setRiskTolerance] = useState<number>(5);
  const [selectedInvestments, setSelectedInvestments] = useState<string[]>([
    investmentTypes.STOCKS_NIFTY50,
    investmentTypes.MUTUAL_FUNDS_EQUITY,
    investmentTypes.FIXED_DEPOSIT,
  ]);
  const [compareData, setCompareData] = useState<InvestmentResult[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [bestInvestment, setBestInvestment] = useState<InvestmentResult | null>(
    null
  );
  const [realTimeRates, setRealTimeRates] = useState<RealTimeRates>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://mern-backend-166800957423.us-central1.run.app";
  // Fetch real-time rates
  useEffect(() => {
    const fetchRealTimeRates = async () => {
      setLoading(true);
      try {
        // In a real implementation, fetch from your API
        const response = await axios.get(
          `${API_BASE_URL}/api/compare/investment-rates`
        );
        setRealTimeRates(response.data);
      } catch (error) {
        console.error("Error fetching real-time rates:", error);
        // Fallback to estimated rates if API fails
        setRealTimeRates({
          [investmentTypes.STOCKS_NIFTY50]: 12.5,
          [investmentTypes.STOCKS_SENSEX]: 12.0,
          [investmentTypes.MUTUAL_FUNDS_EQUITY]: 11.0,
          [investmentTypes.MUTUAL_FUNDS_DEBT]: 6.5,
          [investmentTypes.MUTUAL_FUNDS_HYBRID]: 8.0,
          [investmentTypes.REAL_ESTATE]: 7.5,
          [investmentTypes.FIXED_DEPOSIT]: 6.0,
          [investmentTypes.GOLD]: 8.0,
          [investmentTypes.PPF]: 7.1,
          [investmentTypes.NPS]: 9.0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRealTimeRates();
  }, []);

  // Calculate results whenever form values change or rates are updated
  useEffect(() => {
    if (
      initialInvestment &&
      duration &&
      selectedInvestments?.length > 0 &&
      !loading
    ) {
      calculateResults();
    }
  }, [
    initialInvestment,
    duration,
    riskTolerance,
    selectedInvestments,
    realTimeRates,
    loading,
  ]);

  // Generate AI summary when best investment changes
  useEffect(() => {
    if (bestInvestment && compareData.length > 0) {
      generateAiSummary();
    }
  }, [bestInvestment]);

  // Calculate investment results
  const calculateResults = () => {
    // Calculate results for each selected investment type
    const results = selectedInvestments.map((type) => {
      const rate = realTimeRates[type] || 0;
      const risk = riskLevels[type];

      // Adjust return based on risk tolerance (simple model for demonstration)
      const adjustedRate = rate * (1 + (risk - riskTolerance) * 0.01);

      const finalValue = calculateCompoundInterest(
        initialInvestment,
        adjustedRate,
        duration
      );
      const profit = finalValue - initialInvestment;
      const yearlyData = calculateYearlyValues(
        initialInvestment,
        adjustedRate,
        duration
      );

      return {
        type,
        initialInvestment,
        rate: adjustedRate,
        risk,
        duration,
        finalValue,
        profit,
        yearlyData,
        liquidity: liquidityRatings[type],
        taxImplication: taxImplications[type],
      };
    });

    // Sort by final value (descending)
    results.sort((a, b) => b.finalValue - a.finalValue);

    // Set data for comparison table
    setCompareData(results);

    // Set best investment
    setBestInvestment(results[0]);

    // Prepare data for chart
    prepareChartData(results);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md p-2 rounded">
          <p className="text-gray-900 dark:text-gray-100 font-medium">{`Year ${label}`}</p>
          <div className="space-y-1 mt-1">
            {payload.map((entry: any, index: number) => (
              <div 
                key={`tooltip-${index}`} 
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-xs text-gray-800 dark:text-gray-200">
                    {entry.name}:
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  // Generate AI summary using Gemini API
  const generateAiSummary = async () => {
    if (!bestInvestment || compareData.length === 0) return;

    setSummaryLoading(true);

    try {
      // Prepare data for Gemini API
      const summaryData = {
        investmentAmount: initialInvestment,
        duration: duration,
        riskTolerance: riskTolerance,
        comparedInvestments: compareData.map((item) => ({
          type: investmentTypeNames[item.type],
          rate: item.rate,
          finalValue: item.finalValue,
          profit: item.profit,
          risk: item.risk,
          liquidity: item.liquidity,
        })),
        bestInvestment: {
          type: investmentTypeNames[bestInvestment.type],
          rate: bestInvestment.rate,
          finalValue: bestInvestment.finalValue,
          profit: bestInvestment.profit,
          risk: bestInvestment.risk,
          liquidity: bestInvestment.liquidity,
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/compare/generate-investment-summary`,
        {
          data: summaryData,
        }
      );

      setAiSummary(response.data.summary);
    } catch (error) {
      console.error("Error generating AI summary:", error);
      setAiSummary(
        "Unable to generate investment recommendation summary. Please try again later."
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  // Prepare data for chart
  const prepareChartData = (results: InvestmentResult[]) => {
    if (!results || results.length === 0) return;

    const chartData: ChartDataPoint[] = [];

    // For each year
    for (let year = 0; year <= duration; year++) {
      const yearData: ChartDataPoint = { year };

      // Add value for each investment type
      results.forEach((result) => {
        const yearValue = result.yearlyData.find((data) => data.year === year);
        yearData[result.type] = yearValue ? yearValue.value : 0;
      });

      chartData.push(yearData);
    }

    setChartData(chartData);
  };

  // Toggle investment selection
  const toggleInvestmentSelection = (type: string) => {
    if (selectedInvestments.includes(type)) {
      setSelectedInvestments(selectedInvestments.filter((t) => t !== type));
    } else {
      setSelectedInvestments([...selectedInvestments, type]);
    }
  };

  // Handle input changes
  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setInitialInvestment(value);
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 50) {
      setDuration(value);
    }
  };

  const handleRiskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setRiskTolerance(value);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-teal-600 dark:text-teal-400" />
          <p className="mt-2 text-gray-600">Loading investment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Investment Comparator</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Compare different investment options side by side and find the best
          one for your financial goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1 bg-white dark:bg-black rounded-lg shadow-md p-6 border border-teal-100 dark:border-teal-900/50">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1">Investment Parameters</h2>
            <p className="text-sm text-gray-500">
              Adjust the values to see real-time comparisons
            </p>
          </div>

          <div className="space-y-6">
            {/* Initial Investment */}
            <div>
              <label
                htmlFor="initialInvestment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Initial Investment (₹)
              </label>
              <input
                type="number"
                id="initialInvestment"
                className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 rounded-md w-full bg-white dark:bg-black text-gray-900 dark:text-gray-100"
                value={initialInvestment}
                onChange={handleInvestmentChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                The amount you plan to invest initially
              </p>
            </div>

            {/* Duration */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration: {duration} years
              </label>
              <input
                type="range"
                id="duration"
                className="w-full accent-teal-600"
                min="1"
                max="50"
                step="1"
                value={duration}
                onChange={handleDurationChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Investment time horizon in years
              </p>
            </div>

            {/* Risk Tolerance */}
            <div>
              <label
                htmlFor="riskTolerance"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Risk Tolerance: {riskTolerance}/10
              </label>
              <input
                type="range"
                id="riskTolerance"
                className="w-full accent-teal-600"
                min="1"
                max="10"
                step="1"
                value={riskTolerance}
                onChange={handleRiskChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Your risk appetite (1: Very Low, 10: Very High)
              </p>
            </div>

            {/* Investment Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(investmentTypes).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-3 py-2 text-sm rounded-md ${
                      selectedInvestments.includes(type)
                        ? "bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600"
                        : "bg-black text-gray-700 border border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 dark:border-teal-800 dark:text-teal-300 dark:hover:bg-teal-900/20"
                    }`}
                    onClick={() => toggleInvestmentSelection(type)}
                  >
                    {investmentTypeNames[type]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Best Investment Card */}
          {bestInvestment && (
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-100 dark:border-teal-900/50 rounded-lg shadow-md p-6">
              {" "}
              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <Award className="text-indigo-500 mr-2" />
                  <h2 className="text-xl font-bold">Best Investment Option</h2>
                </div>
                <p className="text-sm text-gray-500">
                  Based on your parameters
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-700">
                    {investmentTypeNames[bestInvestment.type]}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 mr-2">Risk Level:</span>
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-black rounded-full mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              bestInvestment.risk >= 8
                                ? "bg-red-500"
                                : bestInvestment.risk >= 5
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${bestInvestment.risk * 10}%` }}
                          ></div>
                        </div>
                        {bestInvestment.risk}/10
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 mr-2">Liquidity:</span>
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-black rounded-full mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              bestInvestment.liquidity >= 8
                                ? "bg-green-500"
                                : bestInvestment.liquidity >= 5
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${bestInvestment.liquidity * 10}%`,
                            }}
                          ></div>
                        </div>
                        {bestInvestment.liquidity}/10
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Projected Return</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(bestInvestment.finalValue)}
                  </p>
                  <p className="text-sm text-green-600">
                    +{formatCurrency(bestInvestment.profit)} (
                    {(
                      (bestInvestment.profit / initialInvestment) *
                      100
                    ).toFixed(2)}
                    %)
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Rate: {bestInvestment.rate.toFixed(2)}% per annum
                  </p>
                </div>
              </div>
              {/* AI Summary */}
              <div className="mt-4 pt-4 border-t border-indigo-100">
                <div className="flex items-center mb-2">
                  <TrendingUp className="text-indigo-500 mr-2" />
                  <h3 className="font-medium">AI Investment Recommendation</h3>
                </div>

                {summaryLoading ? (
                  <div className="flex items-center text-gray-500">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-teal-600 dark:text-teal-400" />
                    Generating investment insights...
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm">{aiSummary}</p>
                )}
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="bg-white dark:bg-black rounded-lg shadow-md border border-teal-100 dark:border-teal-900/50">
            <div className="p-4 border-b border-teal-100 dark:border-teal-900/50">
              <h2 className="text-xl font-bold text-teal-800 dark:text-teal-300">
                Growth Comparison
              </h2>

              <p className="text-sm text-gray-500">
                Projected growth over {duration} years
              </p>
            </div>
            <div className="p-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="year"
                      label={{
                        value: "Years",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `₹${value.toLocaleString("en-IN", {
                          notation: "compact",
                          compactDisplay: "short",
                        })}`
                      }
                      label={{
                        value: "Value (₹)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip content={CustomTooltip} />
                    <Legend />
                    {selectedInvestments.map((type) => (
                      <Line
                        key={type}
                        type="monotone"
                        dataKey={type}
                        name={investmentTypeNames[type]}
                        stroke={chartColors[type]}
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white dark:bg-black rounded-lg shadow-md border border-teal-100 dark:border-teal-900/50">
            <div className="p-4 border-b border-teal-100 dark:border-teal-900/50">
              <h2 className="text-xl font-bold text-teal-800 dark:text-teal-300">
                Investment Comparison
              </h2>
              <p className="text-sm text-gray-500">
                Side-by-side comparison of all selected investments
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-teal-50 dark:bg-teal-900/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Investment Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Est. Return Rate
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liquidity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Final Value
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Profit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
                  {compareData.map((item) => (
                    <tr
                      key={item.type}
                      className="hover:bg-teal-50 dark:hover:bg-teal-900/10"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-medium">
                          {investmentTypeNames[item.type]}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {item.rate.toFixed(2)}%
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-black rounded-full mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.risk >= 8
                                  ? "bg-red-500"
                                  : item.risk >= 5
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${item.risk * 10}%` }}
                            ></div>
                          </div>
                          {item.risk}/10
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-black rounded-full mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.liquidity >= 8
                                  ? "bg-green-500"
                                  : item.liquidity >= 5
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${item.liquidity * 10}%` }}
                            ></div>
                          </div>
                          {item.liquidity}/10
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right font-medium">
                        {formatCurrency(item.finalValue)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-green-600">
                        +{formatCurrency(item.profit)}
                        <br />
                        <span className="text-xs">
                          (
                          {((item.profit / initialInvestment) * 100).toFixed(2)}
                          %)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tax Implications Section */}
            <div className="p-4 border-t border-teal-100 dark:border-teal-900/50">
              <h3 className="font-medium mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                Tax Implications
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {compareData.map((item) => (
                  <div
                    key={`tax-${item.type}`}
                    className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded"
                  >
                    <span className="font-medium">
                      {investmentTypeNames[item.type]}
                    </span>
                    : {item.taxImplication}
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 border-t border-teal-100 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-900/20 text-xs text-gray-500 dark:text-gray-400">
              <p>
                Disclaimer: The projections shown are based on historical data
                and estimated returns. Actual investment performance may vary.
                Past performance is not indicative of future results. Please
                consult with a financial advisor before making investment
                decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Educational Section */}
      <div className="mt-8 bg-white dark:bg-black rounded-lg shadow-md border border-teal-100 dark:border-teal-900/50 p-6">
        <h2 className="text-xl font-bold mb-4 text-teal-800 dark:text-teal-300">
          Understanding Your Investment Options
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Risk vs. Return</h3>
            <p className="text-sm text-gray-600 mb-2">
              Generally, investments with higher potential returns come with
              higher risks. It's important to balance your portfolio according
              to your risk tolerance and financial goals.
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium">Low Risk</span>: Fixed Deposits,
                PPF
              </li>
              <li>
                <span className="font-medium">Moderate Risk</span>: Debt Mutual
                Funds, Gold, NPS
              </li>
              <li>
                <span className="font-medium">High Risk</span>: Equity Mutual
                Funds, Stocks, Real Estate
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">
              Liquidity Considerations
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Liquidity refers to how quickly an investment can be converted to
              cash without significant loss in value. Consider your need for
              emergency funds when investing.
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium">High Liquidity</span>: Stocks,
                Equity Mutual Funds
              </li>
              <li>
                <span className="font-medium">Moderate Liquidity</span>: Gold,
                Debt Mutual Funds
              </li>
              <li>
                <span className="font-medium">Low Liquidity</span>: Real Estate,
                NPS, PPF
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-teal-100 dark:border-teal-900/50">
          <h3 className="text-lg font-medium mb-2">Tax Efficiency</h3>
          <p className="text-sm text-gray-600 mb-2">
            Different investment types have different tax treatments in India.
            Tax-efficient investing can significantly improve your overall
            returns.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-base font-medium mb-1">
                Tax-Advantaged Options
              </h4>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>
                  <span className="font-medium">PPF</span>: EEE
                  (Exempt-Exempt-Exempt) tax status
                </li>
                <li>
                  <span className="font-medium">NPS</span>: Additional tax
                  benefit under Section 80CCD(1B)
                </li>
                <li>
                  <span className="font-medium">ELSS Mutual Funds</span>: Tax
                  benefits under Section 80C
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-medium mb-1">Capital Gains Tax</h4>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>
                  <span className="font-medium">Equity</span>: 10% LTCG tax
                  above ₹1 lakh
                </li>
                <li>
                  <span className="font-medium">Debt</span>: 20% LTCG tax with
                  indexation
                </li>
                <li>
                  <span className="font-medium">Real Estate</span>: 20% LTCG tax
                  with indexation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
