import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from 'lucide-react';

interface Props {
  data: {
    totalIncome: number;
    totalExpenses: number;
    gstPayable: number;
    gstCredit: number;
    netGst: number;
  };
}

// Format currency in Indian Rupees
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export default function TaxSummary({ data }: Props) {
  return (
    <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
        <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Tax Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-md bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Income</p>
              <p className="text-lg font-semibold text-teal-700 dark:text-teal-300">{formatCurrency(data.totalIncome)}</p>
            </div>
            <div className="p-3 rounded-md bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Expenses</p>
              <p className="text-lg font-semibold text-teal-700 dark:text-teal-300">{formatCurrency(data.totalExpenses)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-md bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">GST Payable</p>
              <p className="text-lg font-semibold text-teal-700 dark:text-teal-300">{formatCurrency(data.gstPayable)}</p>
            </div>
            <div className="p-3 rounded-md bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">GST Credit</p>
              <p className="text-lg font-semibold text-teal-700 dark:text-teal-300">{formatCurrency(data.gstCredit)}</p>
            </div>
            <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Net GST</p>
              <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">{formatCurrency(data.netGst)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
