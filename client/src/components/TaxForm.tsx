// src/components/TaxForm.tsx
import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as 'income' | 'expense' })}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
      <label>
        <input type="checkbox" checked={form.gstIncluded} onChange={e => setForm({ ...form, gstIncluded: e.target.checked })} />
        GST Included
      </label>
      <button type="submit">Add Entry</button>
    </form>
  );
}
