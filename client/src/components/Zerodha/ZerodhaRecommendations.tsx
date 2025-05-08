import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, Sparkles, TrendingUp } from "lucide-react";
import { Recommendation } from "./ZerodhaPortfolio";

interface ZerodhaRecommendationsProps {
  recommendations: Recommendation[];
}

export default function ZerodhaRecommendations({ recommendations }: ZerodhaRecommendationsProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFund, setSelectedFund] = useState<Recommendation | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "moderate":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
    }
  };

  const handleOpenDialog = (fund: Recommendation) => {
    setSelectedFund(fund);
    setOpenDialog(true);
  };

  return (
    <>
      <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recommended SIPs Based on Your Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fund Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead className="text-right">1Y Return</TableHead>
                  <TableHead className="text-right">3Y Return</TableHead>
                  <TableHead className="text-right">Suggested SIP</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.map((fund) => (
                  <TableRow key={fund.schemeCode}>
                    <TableCell className="font-medium">{fund.schemeName}</TableCell>
                    <TableCell>{fund.category}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(fund.riskLevel)}`}>
                        {fund.riskLevel}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={fund.returns.oneYear >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatPercentage(fund.returns.oneYear)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={fund.returns.threeYear >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatPercentage(fund.returns.threeYear)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(fund.suggestedSipAmount)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDialog(fund)}
                      >
                        See Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-600" />
              {selectedFund?.schemeName}
            </DialogTitle>
            <DialogDescription>
              SIP recommendation details and setup instructions
            </DialogDescription>
          </DialogHeader>
          
          {selectedFund && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-md">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Category</p>
                  <p className="font-medium">{selectedFund.category}</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-md">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Risk Level</p>
                  <p className={`font-medium inline-flex items-center ${
                    selectedFund.riskLevel.toLowerCase() === "high" 
                      ? "text-red-600" 
                      : selectedFund.riskLevel.toLowerCase() === "moderate" 
                        ? "text-amber-600" 
                        : "text-green-600"
                  }`}>
                    {selectedFund.riskLevel}
                  </p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-md">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Minimum SIP Amount</p>
                  <p className="font-medium">{formatCurrency(selectedFund.minSipAmount)}</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-md">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Suggested Monthly SIP</p>
                  <p className="font-medium text-teal-600">{formatCurrency(selectedFund.suggestedSipAmount)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Historical Returns</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">1 Year</p>
                    <p className={`font-medium ${selectedFund.returns.oneYear >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatPercentage(selectedFund.returns.oneYear)}
                    </p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">3 Year</p>
                    <p className={`font-medium ${selectedFund.returns.threeYear >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatPercentage(selectedFund.returns.threeYear)}
                    </p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">5 Year</p>
                    <p className={`font-medium ${selectedFund.returns.fiveYear >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatPercentage(selectedFund.returns.fiveYear)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-md border border-teal-100 dark:border-teal-900/50">
                <h4 className="font-medium text-teal-800 dark:text-teal-300 mb-2">Why We Recommend This Fund</h4>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm">{selectedFund.rationale}</p>
              </div>
              
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-md border border-emerald-100 dark:border-emerald-900/50">
                <h4 className="font-medium text-emerald-800 dark:text-emerald-300 mb-2">
                  How to Set Up Your SIP in {selectedFund.schemeName}
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <li>Log in to your Zerodha Coin account</li>
                  <li>Search for fund "{selectedFund.schemeName}" by name or code {selectedFund.schemeCode}</li>
                  <li>Click on "Invest Now" button</li>
                  <li>Select "SIP" option</li>
                  <li>Enter monthly amount: {formatCurrency(selectedFund.suggestedSipAmount)}</li>
                  <li>Choose preferred SIP date</li>
                  <li>Complete the transaction by following the on-screen instructions</li>
                </ol>
              </div>
              
              <div className="text-center pt-2">
                <Button 
                  onClick={() => window.open(`https://coin.zerodha.com/funds/${selectedFund.schemeCode}`, "_blank")}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Start SIP on Zerodha Coin
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}