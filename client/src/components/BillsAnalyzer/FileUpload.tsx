// src/components/BillsAnalyzer/FileUpload.tsx
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { ExplanationCard } from '@/components/ExplanationCard';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
    <div className="max-w-3xl mx-auto mt-8 p-4 border rounded-lg shadow-sm bg-white">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">Drag & drop a file here, or click to select a file</p>
      </div>

      {isProcessing && <p className="mt-4 text-sm text-blue-600">📄 Extracting text...</p>}
      {file && !isProcessing && <p className="mt-2 text-sm text-green-700">✅ Uploaded: {file.name}</p>}

      {extractedText && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-1 text-gray-800">📝 Extracted Text:</h3>
          <pre className="bg-gray-50 p-3 rounded border text-sm max-h-48 overflow-auto whitespace-pre-wrap text-gray-700">
            {extractedText}
          </pre>
        </div>
      )}

      {explanation && (
        <ExplanationCard
          explanation={explanation}
          onRegenerate={() => fetchExplanation(extractedText)}
          isLoading={isExplaining}
        />
      )}
    </div>
  );
};

export default FileUpload;
