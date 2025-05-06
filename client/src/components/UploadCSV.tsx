import { ChangeEvent } from 'react';

interface Props {
  onFileSelect: (file: File) => void;
}

export default function UploadCSV({ onFileSelect }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div>
      <label htmlFor="csv-upload" className="block text-sm font-medium mb-2">
        Upload your CSV file:
      </label>
      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="border rounded p-2 w-full"
      />
    </div>
  );
}
