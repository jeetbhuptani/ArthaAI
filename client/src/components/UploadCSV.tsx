import { ChangeEvent, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
}

export default function UploadCSV({ onFileSelect }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };
  
  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="csv-upload" className="text-base block mb-2 text-teal-700 dark:text-teal-300">
        Upload your CSV file:
      </Label>
      
      <div className="border-2 border-dashed border-teal-200 dark:border-teal-800 rounded-md p-6 text-center cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors">
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
        />
        
        {!selectedFile ? (
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 mb-2 text-teal-500 dark:text-teal-400" />
            <Label htmlFor="csv-upload" className="cursor-pointer">
              <span className="text-teal-700 dark:text-teal-300 font-medium">Click to upload</span> or drag and drop
            </Label>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              CSV files only
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-teal-50 dark:bg-teal-900/20 p-3 rounded-md">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
              <span className="text-teal-700 dark:text-teal-300 font-medium">{selectedFile.name}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.preventDefault();
                clearFile();
              }}
              className="text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {selectedFile && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          File size: {(selectedFile.size / 1024).toFixed(2)} KB
        </p>
      )}
    </div>
  );
}
