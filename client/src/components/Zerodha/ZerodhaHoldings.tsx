import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowUp, Search, TrendingDown, TrendingUp } from "lucide-react";
import { PortfolioHolding } from "./ZerodhaPortfolio";

interface ZerodhaHoldingsProps {
  holdings: PortfolioHolding[];
}

export default function ZerodhaHoldings({ holdings }: ZerodhaHoldingsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof PortfolioHolding>("tradingSymbol");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof PortfolioHolding) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  const filteredHoldings = holdings.filter((holding) =>
    holding.tradingSymbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedHoldings = [...filteredHoldings].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  return (
    <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
        <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Stock Holdings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search holdings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-zinc-300 dark:border-zinc-700"
          />
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => handleSort("tradingSymbol")}
                >
                  Symbol
                  {sortField === "tradingSymbol" && (
                    sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => handleSort("quantity")}
                >
                  Qty
                  {sortField === "quantity" && (
                    sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => handleSort("averageBuyPrice")}
                >
                  Avg. Price
                  {sortField === "averageBuyPrice" && (
                    sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => handleSort("lastPrice")}
                >
                  LTP
                  {sortField === "lastPrice" && (
                    sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => handleSort("pnl")}
                >
                  P&L
                  {sortField === "pnl" && (
                    sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => handleSort("dayChangePercentage")}
                >
                  Day Change
                  {sortField === "dayChangePercentage" && (
                    sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHoldings.length > 0 ? (
                sortedHoldings.map((holding) => (
                  <TableRow key={holding.tradingSymbol}>
                    <TableCell className="font-medium">{holding.tradingSymbol}</TableCell>
                    <TableCell className="text-right">{holding.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(holding.averageBuyPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(holding.lastPrice)}</TableCell>
                    <TableCell className={`text-right ${holding.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(holding.pnl)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {holding.dayChangePercentage > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={holding.dayChangePercentage >= 0 ? "text-green-600" : "text-red-600"}>
                          {formatPercentage(holding.dayChangePercentage)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-zinc-500">
                    {searchTerm ? "No holdings match your search" : "No holdings found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}