"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

import {
  UserProfileForm,
  type UserProfileData,
} from "@/components/UserProfileForm";
import {
  InvestmentExperienceForm,
  type InvestmentExperienceData,
} from "@/components/InvestmentExperienceForm";
import {
  RiskMonitoringForm,
  type RiskMonitoringData,
} from "@/components/RiskMonitoringForm";
import {
  ImprovedGoalsReasonsForm,
  type ImprovedGoalsData,
} from "@/components/GoalsReasonsForm";

// Combined form data type
interface FinancialFormData
  extends Partial<UserProfileData>,
    Partial<InvestmentExperienceData>,
    Partial<RiskMonitoringData>,
    Partial<ImprovedGoalsData> {
  // Additional fields can be added here if needed
  [key: string]: any;
}

const steps = [
  "Basic Info",
  "Investment Experience",
  "Risk Monitoring",
  "Financial Goals",
  "Review & Submit",
];

export default function FinancialFormWizard() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FinancialFormData>(() => {
    const stored = localStorage.getItem("financialFormData");
    return stored ? JSON.parse(stored) : {};
  });
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  useEffect(() => {
    getFinancialFormData();
  }, []);
  
  const updateFormData = (sectionData: Partial<FinancialFormData>) => {
    const updated = { ...formData, ...sectionData };
    setFormData(updated);
    localStorage.setItem("financialFormData", JSON.stringify(updated));
    next(); // Automatically go to next step after updating data
  };

  //Get FinancialFormData from Backend API
  const getFinancialFormData = async () => {
    try {
      const response = await fetch(`/api/user/get-wizard-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      
      if (response.ok) {
        const jsonResponse = await response.json();
        const data = jsonResponse.wizardData;
        if (data) {
          setFormData(data);
        }
      }
    } catch (error) {
      console.error("Error fetching wizard data:", error);
    }
  };
  // In FinancialFormWizard.tsx
  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/user/complete-wizard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Clear locally stored form data
        // localStorage.removeItem("financialFormData");

        // Redirect to dashboard
        window.location.href = "/";
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const renderComplexValue = (value: any) => {
    // Handle financial goals array specially
    if (
      Array.isArray(value) &&
      value[0] &&
      typeof value[0] === "object" &&
      "goal" in value[0]
    ) {
      return (
        <div className="space-y-2">
          {value.map((goal, idx) => (
            <div
              key={idx}
              className="pl-3 py-2 border-l-2 border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/20 rounded"
            >
              <div>
                <strong>Goal:</strong> {goal.goal}
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <strong>Timeline:</strong> {goal.timeline}
                </div>
                <div>
                  <strong>Amount:</strong> {goal.targetAmount}
                </div>
                <div>
                  <strong>Priority:</strong> {goal.priority}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Handle regular arrays
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    // Handle nested objects
    if (value && typeof value === "object") {
      return (
        <div className="space-y-1 pl-3">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="flex flex-wrap">
              <span className="font-medium capitalize w-32">
                {subKey.replace(/([A-Z])/g, " $1")}:
              </span>
              <span>{String(subValue)}</span>
            </div>
          ))}
        </div>
      );
    }

    return String(value);
  };

  const renderReview = () => (
    <div className="space-y-4">
      {Object.entries(formData).map(([key, value]) => {
        // Skip empty values
        if (
          value === undefined ||
          value === null ||
          (Array.isArray(value) && value.length === 0) ||
          value === ""
        ) {
          return null;
        }

        // Group sections with headers
        const getSection = (key: string) => {
          if (
            [
              "gender",
              "age",
              "marital_status",
              "education_level",
              "has_dependents",
              "tier_city",
              "life_stage",
              "salaried_employee",
            ].includes(key)
          )
            return "Basic Information";
          if (
            [
              "investInAvenues",
              "investInStockMarket",
              "mostlyInvestIn",
              "investmentObjectives",
              "investment_experience_years",
              "investment_knowledge",
              "investment_preference",
              "prefers_tax_saving",
              "risk_tolerance_self_reported",
              "existing_investments",
            ].includes(key)
          )
            return "Investment Experience";
          if (
            [
              "investmentDuration",
              "monitoringFrequency",
              "investmentFactors",
              "investment_horizon_years",
              "expected_return",
              "short_term",
              "medium_term",
              "long_term",
              "tax_bracket",
            ].includes(key)
          )
            return "Risk & Monitoring";
          if (
            [
              "financialGoals",
              "financialConcerns",
              "existingDebts",
              "monthly_income",
              "annual_income",
              "monthly_expenses",
              "emergency_fund",
              "emergency_fund_months",
              "existing_loans",
              "debt_to_income",
              "savings_rate",
              "investment_capacity",
              "insurance_coverage",
            ].includes(key)
          )
            return "Financial Goals & Situation";
          if (
            ["knowledgeLevel", "willingnessToLearn", "extraContext"].includes(
              key
            )
          )
            return "Financial Knowledge";
          return "Other Information";
        };

        return (
          <div
            key={key}
            className="border border-teal-100 dark:border-teal-900/50 p-3 rounded-md bg-white dark:bg-zinc-900 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h3 className="font-medium capitalize text-teal-700 dark:text-teal-300">
                {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
              </h3>
              <span className="text-xs bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-2 py-1 rounded">
                {getSection(key)}
              </span>
            </div>
            <div className="pl-1">{renderComplexValue(value)}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <TooltipProvider>
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 mb-4">
            Financial Profile Wizard
          </h1>
          <div className="flex justify-center gap-2 mt-4">
            {steps.map((stepName, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`h-2 w-12 rounded-full ${
                    i < step
                      ? "bg-teal-500 dark:bg-teal-400"
                      : i === step
                      ? "bg-teal-300 dark:bg-teal-600"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
                <span
                  className={`text-xs mt-1 ${
                    i === step
                      ? "text-teal-600 dark:text-teal-400 font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {stepName}
                </span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <UserProfileForm data={formData} update={updateFormData} />
            )}
            {step === 1 && (
              <InvestmentExperienceForm
                data={formData}
                update={updateFormData}
              />
            )}
            {step === 2 && (
              <RiskMonitoringForm data={formData} update={updateFormData} />
            )}
            {step === 3 && (
              <ImprovedGoalsReasonsForm
                data={formData}
                update={updateFormData}
              />
            )}
            {step === 4 && (
              <div className="bg-white dark:bg-zinc-900 border border-teal-100 dark:border-teal-900/50 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-teal-700 dark:text-teal-300 mb-4">
                  Review Your Financial Profile
                </h2>
                {renderReview()}
                <div className="mt-8">
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
                  >
                    Submit Financial Profile
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {step < 4 && (
          <div className="flex justify-between mt-6">
            <Button
              onClick={back}
              disabled={step === 0}
              variant="outline"
              className="border-zinc-300 dark:border-zinc-700"
            >
              Back
            </Button>
            <Button
              onClick={next}
              disabled={step === steps.length - 1}
              className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
