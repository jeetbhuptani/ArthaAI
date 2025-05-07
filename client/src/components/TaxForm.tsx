import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Receipt } from 'lucide-react';

interface Props {
  onSubmit: (entries: any[]) => void;
}

export default function TaxForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    date: '',
    category: 'income',
    description: '',
    amount: '',
    gstIncluded: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry = {
      ...form,
      amount: parseFloat(form.amount),
    };

    onSubmit([entry]); // Send as array to allow batch handling
    setForm({ date: '', category: 'income', description: '', amount: '', gstIncluded: false });
  };

  return (
    <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
        <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Add Tax Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm text-zinc-700 dark:text-zinc-300">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm text-zinc-700 dark:text-zinc-300">
                Category
              </Label>
              <Select value={form.category} onValueChange={value => setForm({ ...form, category: value })}>
                <SelectTrigger id="category" className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-zinc-700 dark:text-zinc-300">
              Description
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm text-zinc-700 dark:text-zinc-300">
                Amount (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 h-full pt-8">
              <Checkbox
                id="gstIncluded"
                checked={form.gstIncluded}
                onCheckedChange={(checked) => setForm({ ...form, gstIncluded: checked === true })}
                className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
              />
              <Label htmlFor="gstIncluded" className="text-sm text-zinc-700 dark:text-zinc-300">
                GST Included
              </Label>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
