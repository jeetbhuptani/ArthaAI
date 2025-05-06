import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UploadCSV from "@/components/UploadCSV";
import TaxSummary from "@/components/TaxSummary";
import axios from "axios";

export default function TaxFillingWizard() {
  const [step, setStep] = useState(0);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Fetch AI suggestions when summary is available
  useEffect(() => {
    if (step === 2 && summary) {
      fetchAISuggestions();
    }
  }, [step, summary]);

  const fetchAISuggestions = async () => {
    try {
      setFetchingSuggestions(true);
      const token = localStorage.getItem("auth_token");
      const { data } = await axios.get(
        `${API_BASE_URL}/api/tax/ai-suggestions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error("Error fetching AI suggestions:", err);
    } finally {
      setFetchingSuggestions(false);
    }
  };

  const handleNext = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (step === 0 && csvFile) {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", csvFile);

        await axios.post(`${API_BASE_URL}/api/tax/upload`, formData, {
          headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data",
          },
        });

        setStep(1);
      } else if (step === 1) {
        setLoading(true);
        const { data } = await axios.get(
          `${API_BASE_URL}/api/tax/calculate`,
          config
        );
        setSummary(data);
        setStep(2);
      }
    } catch (err) {
      console.error("Error during wizard step:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      setLoading(true);

      // Use axios to get the PDF file with proper headers
      const response = await axios.get(`${API_BASE_URL}/api/tax/download-pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Important: tells axios to handle response as binary data
      });

      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `tax_report_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 p-6">
      <CardContent>
        {step === 0 && <UploadCSV onFileSelect={setCsvFile} />}
        {step === 1 && (
          <p>Click next to calculate tax based on your uploaded CSV.</p>
        )}
        {step === 2 && summary && (
          <div className="space-y-8">
            <TaxSummary data={summary} />

            {fetchingSuggestions ? (
              <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded animate-pulse">
                <p className="text-center">Generating AI suggestions...</p>
              </div>
            ) : suggestions ? (
              <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded">
                <h3 className="text-lg font-medium mb-2">
                  💡 AI Tax Suggestions
                </h3>
                <div className="text-sm whitespace-pre-line">{suggestions}</div>
              </div>
            ) : null}

            <Button
              variant="outline"
              className="w-full"
              onClick={handleDownloadPDF}
              disabled={loading}
            >
              {loading ? "Generating PDF..." : "📄 Download Tax Report (PDF)"}
            </Button>
          </div>
        )}

        <Button
          className="mt-6 w-full"
          onClick={handleNext}
          disabled={loading || (step === 0 && !csvFile)}
        >
          {loading ? "Processing..." : step === 2 ? "Done" : "Next"}
        </Button>
      </CardContent>
    </Card>
  );
}
