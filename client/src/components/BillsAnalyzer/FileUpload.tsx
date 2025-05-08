import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { ExplanationCard } from '@/components/ExplanationCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2 } from 'lucide-react';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://mern-backend-166800957423.us-central1.run.app";

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    uploadFile(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    onDrop,
  });

  const uploadFile = async (file: File) => {
    setIsProcessing(true);
    setExplanation('');
    setExtractedText('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const text = response.data.text;
      setExtractedText(text);
      await fetchExplanation(text);
    } catch (error) {
      console.error('Error uploading file', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchExplanation = async (text: string) => {
    setIsExplaining(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/explain`, { extractedText: text });
      setExplanation(response.data.explanation);
    } catch (error) {
      console.error('Error getting explanation', error);
      setExplanation('Could not generate explanation. Please try again.');
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <Card className="max-w-7xl mx-auto my-8 border-teal-100 dark:border-teal-900/50 shadow-md">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
        <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2 mt-6">
          <FileText className="h-5 w-5" />
          Document Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-teal-200 dark:border-teal-800 rounded-md p-6 text-center cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors"
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 mx-auto mb-2 text-teal-500 dark:text-teal-400" />
          <p className="text-teal-700 dark:text-teal-300 font-medium">Drag & drop a file here, or click to select a file</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Supported formats: PDF, JPG, PNG
          </p>
        </div>

        {isProcessing && (
          <div className="mt-4 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <p>Extracting text...</p>
          </div>
        )}
        
        {file && !isProcessing && (
          <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-md border border-teal-100 dark:border-teal-900/50">
            <p className="text-sm flex items-center">
              <FileText className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
              <span className="text-teal-700 dark:text-teal-300 font-medium">Uploaded:</span>
              <span className="ml-2 text-zinc-600 dark:text-zinc-300">{file.name}</span>
            </p>
          </div>
        )}

        {extractedText && (
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-teal-700 dark:text-teal-300 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Extracted Text:
            </h3>
            <pre className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-md border border-zinc-200 dark:border-zinc-800 text-sm max-h-48 overflow-auto whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {extractedText}
            </pre>
          </div>
        )}

        {explanation && (
          <div className="mt-6">
            <ExplanationCard
              explanation={explanation}
              onRegenerate={() => fetchExplanation(extractedText)}
              isLoading={isExplaining}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
