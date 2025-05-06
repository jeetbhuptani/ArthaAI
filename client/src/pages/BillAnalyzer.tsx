// src/App.tsx
import React from 'react';
import FileUpload from '../components/BillsAnalyzer/FileUpload';

const BillsAnalyzer = () => {
  return (
    <div>
      <h1>ITR & Bills Analyzer</h1>
      <FileUpload />
    </div>
  );
};

export default BillsAnalyzer;