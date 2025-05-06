import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UploadCSV from '@/components/UploadCSV';
import TaxSummary from '@/components/TaxSummary';
import axios from 'axios';

export default function TaxFillingWizard() {
  const [step, setStep] = useState(0);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const handleNext = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (step === 0 && csvFile) {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', csvFile);

        await axios.post(`${API_BASE_URL}/api/tax/upload`, formData, {
          headers: {
            ...config.headers,
            'Content-Type': 'multipart/form-data',
          },
        });

        setStep(1);
      } else if (step === 1) {
        const { data } = await axios.get(`${API_BASE_URL}/api/tax/calculate`, config);
        setSummary(data);
        setStep(2);
      }
    } catch (err) {
      console.error('Error during wizard step:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 p-6">
      <CardContent>
        {step === 0 && <UploadCSV onFileSelect={setCsvFile} />}
        {step === 1 && <p>Click next to calculate tax based on your uploaded CSV.</p>}
        {step === 2 && summary && <TaxSummary data={summary} />}

        <Button className="mt-6" onClick={handleNext} disabled={loading}>
          {loading ? 'Processing...' : step === 2 ? 'Done' : 'Next'}
        </Button>
      </CardContent>
    </Card>
  );
}