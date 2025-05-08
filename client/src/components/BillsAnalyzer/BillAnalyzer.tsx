import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from './FileUpload';
import { FileText } from 'lucide-react';

const BillsAnalyzer = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="border-teal-100 dark:border-teal-900/50 shadow-md mb-8">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-2xl text-teal-800 dark:text-teal-300 flex items-center gap-2 mt-6">
            <FileText className="h-6 w-6" />
            ITR & Bills Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Upload your financial documents to extract information and get AI-powered explanations. 
            Supported formats include PDF, JPG, and PNG files.
          </p>
          
          <FileUpload />
        </CardContent>
      </Card>
    </div>
  );
};

export default BillsAnalyzer;
