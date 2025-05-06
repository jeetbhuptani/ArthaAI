interface Props {
    data: {
      totalIncome: number;
      totalExpenses: number;
      gstPayable: number;
      gstCredit: number;
      netGst: number;
    };
  }
  
  export default function TaxSummary({ data }: Props) {
    return (
      <div>
        <h2 className="text-lg font-bold mb-4">Tax Summary</h2>
        <ul className="space-y-2">
          <li>Total Income: ₹{data.totalIncome}</li>
          <li>Total Expenses: ₹{data.totalExpenses}</li>
          <li>GST Payable: ₹{data.gstPayable}</li>
          <li>GST Credit: ₹{data.gstCredit}</li>
          <li>Net GST: ₹{data.netGst}</li>
        </ul>
      </div>
    );
  }
  