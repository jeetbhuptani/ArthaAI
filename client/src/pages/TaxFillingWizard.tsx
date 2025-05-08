"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UploadCSV from "@/components/UploadCSV";
import TaxSummary from "@/components/TaxSummary";
import {
  Loader2,
  FileDown,
  Calculator,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function TaxFillingWizard() {
  const [step, setStep] = useState(0);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "";

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
        responseType: "blob", 
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

  const steps = [
    { title: "Upload CSV", icon: <FileSpreadsheet className="h-5 w-5" /> },
    { title: "Process Data", icon: <Calculator className="h-5 w-5" /> },
    { title: "View Results", icon: <CheckCircle2 className="h-5 w-5" /> },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto border-teal-100 dark:border-teal-900/50 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-2xl text-teal-800 dark:text-teal-300 mt-6">
            Tax Filing Wizard
          </CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Complete the steps below to analyze your tax data
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-1">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    i < step
                      ? "bg-teal-600 text-white"
                      : i === step
                      ? "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300"
                      : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                  }`}
                >
                  {s.icon}
                </div>
                <span
                  className={`mt-2 text-xs ${
                    i <= step
                      ? "text-teal-600 dark:text-teal-400 font-medium"
                      : "text-zinc-500"
                  }`}
                >
                  {s.title}
                </span>
                {/* {i < steps.length - 1 && (
                  <div
                    className={`hidden md:block h-[2px] w-16 ${
                      i < step
                        ? "bg-teal-600 dark:bg-teal-400"
                        : "bg-zinc-200 dark:bg-zinc-700"
                    } absolute left-[calc(${
                      (i + 0.5) * (100 / steps.length)
                    }% - 8px)]`}
                  />
                )} */}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="mt-6">
            {step === 0 && (
              <div className="space-y-6">
                <UploadCSV onFileSelect={setCsvFile} />
              </div>
            )}

            {step === 1 && (
              <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-md border border-teal-100 dark:border-teal-900/50 text-center">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-teal-600 dark:text-teal-400" />
                <h3 className="text-lg font-medium text-teal-700 dark:text-teal-300 mb-2">
                  Ready to Calculate
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Your CSV has been uploaded successfully. Click next to
                  calculate tax based on your data.
                </p>
              </div>
            )}

            {step === 2 && summary && (
              <div className="space-y-8">
                <TaxSummary data={summary} />

                {fetchingSuggestions ? (
                  <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-md border border-teal-100 dark:border-teal-900/50 animate-pulse">
                    <div className="flex items-center">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin text-teal-600 dark:text-teal-400" />
                      <p className="text-teal-700 dark:text-teal-300">
                        Generating AI suggestions...
                      </p>
                    </div>
                  </div>
                ) : suggestions ? (
                  <Card className="border-teal-100 dark:border-teal-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-teal-700 dark:text-teal-300 flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        AI Tax Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm whitespace-pre-line text-zinc-700 dark:text-zinc-300">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {suggestions}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                <Button
                  variant="outline"
                  className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 dark:border-teal-800 dark:text-teal-300 dark:hover:bg-teal-900/20"
                  onClick={handleDownloadPDF}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4 mr-2" />
                      Download Tax Report (PDF)
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-end">
            {step < 2 && (
              <Button
                onClick={handleNext}
                disabled={loading || (step === 0 && !csvFile)}
                className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {step === 0 ? "Upload & Continue" : "Calculate Tax"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}

            {step === 2 && (
              <Button
                onClick={() => setStep(0)}
                className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
              >
                Start New Analysis
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
