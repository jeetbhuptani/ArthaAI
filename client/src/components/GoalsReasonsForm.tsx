"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FinancialTermTooltip } from "@/components/FinancialTermTooltip";
import { ArrowRight, Target, Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  // Financial Goals with Timeline and Priority
  financialGoals: z
    .array(
      z.object({
        goal: z.string().min(2, "Goal name is required"),
        timeline: z.string().min(1, "Timeline is required"),
        targetAmount: z.string().min(1, "Target amount is required"),
        priority: z.string().min(1, "Priority is required"),
      })
    )
    .min(1, "At least one financial goal is required"),

  // Key Financial Concerns
  financialConcerns: z
    .array(z.string())
    .min(1, "Select at least one financial concern"),

  existingDebts: z.string(),

  // Financial Knowledge Self-Assessment
  knowledgeLevel: z.string().min(1, "Knowledge level is required"),
  willingnessToLearn: z.string().min(1, "This field is required"),

  // Additional Context
  extraContext: z.string().optional(),

  // ML Model Fields
  monthly_income: z.number().min(0),
  annual_income: z.number().min(0),
  monthly_expenses: z.number().min(0),
  emergency_fund: z.number().min(0),
  emergency_fund_months: z.number().min(0),
  existing_loans: z.boolean().optional(),
  debt_to_income: z.number().min(0).max(1),
  savings_rate: z.number().min(0).max(1),
  investment_capacity: z.number().min(0),
  insurance_coverage: z.number().min(0),
});

const TIMELINE_OPTIONS = [
  "< 1 Year",
  "1-3 Years",
  "3-5 Years",
  "5-10 Years",
  "10+ Years",
];

const PRIORITY_OPTIONS = ["Critical", "High", "Medium", "Low"];

const FINANCIAL_CONCERNS = [
  "Market Volatility",
  "Inflation",
  "Unexpected Expenses",
  "Job Security",
  "Health Costs",
  "Retirement Adequacy",
  "Tax Burden",
  "Debt Management",
];

const KNOWLEDGE_LEVELS = [
  "Beginner - New to investing",
  "Basic - Understand fundamental concepts",
  "Intermediate - Comfortable with most investment products",
  "Advanced - Understand complex investment strategies",
  "Expert - Professional experience in finance",
];

// Define the type for the form data
export type ImprovedGoalsData = z.infer<typeof formSchema>;

// Define the props interface for the component
interface ImprovedGoalsReasonsFormProps {
  data: Partial<ImprovedGoalsData>;
  update: (data: ImprovedGoalsData) => void;
}

export function ImprovedGoalsReasonsForm({
  data,
  update,
}: ImprovedGoalsReasonsFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ImprovedGoalsData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financialGoals: data.financialGoals || [
        { goal: "", timeline: "", targetAmount: "", priority: "" },
      ],
      financialConcerns: data.financialConcerns || [],
      monthly_income: data.monthly_income || 0,
      existingDebts: data.existingDebts || "",
      knowledgeLevel: data.knowledgeLevel || "",
      willingnessToLearn: data.willingnessToLearn || "",
      extraContext: data.extraContext || "",
      annual_income: data.annual_income || 0,
      monthly_expenses: data.monthly_expenses || 0,
      emergency_fund: data.emergency_fund || 0,
      emergency_fund_months: data.emergency_fund_months || 0,
      existing_loans: data.existing_loans || false,
      debt_to_income: data.debt_to_income || 0,
      savings_rate: data.savings_rate || 0,
      investment_capacity: data.investment_capacity || 0,
      insurance_coverage: data.insurance_coverage || 0,
    },
  });

  // Watch for the financial goals array
  const financialGoals = watch("financialGoals");

  // Pre-fill form with existing data
  useEffect(() => {
    if (data.financialGoals && data.financialGoals.length > 0) {
      setValue("financialGoals", data.financialGoals);
    }
    if (data.financialConcerns && data.financialConcerns.length > 0) {
      setValue("financialConcerns", data.financialConcerns);
    }
    if (data.existingDebts) {
      setValue("existingDebts", data.existingDebts);
    }
    if (data.knowledgeLevel) {
      setValue("knowledgeLevel", data.knowledgeLevel);
    }
    if (data.willingnessToLearn) {
      setValue("willingnessToLearn", data.willingnessToLearn);
    }
    if (data.extraContext) {
      setValue("extraContext", data.extraContext);
    }
    if (data.monthly_income !== undefined) {
      setValue("monthly_income", data.monthly_income);
    }
    if (data.annual_income !== undefined) {
      setValue("annual_income", data.annual_income);
    }
    if (data.monthly_expenses !== undefined) {
      setValue("monthly_expenses", data.monthly_expenses);
    }
    if (data.emergency_fund !== undefined) {
      setValue("emergency_fund", data.emergency_fund);
    }
    if (data.emergency_fund_months !== undefined) {
      setValue("emergency_fund_months", data.emergency_fund_months);
    }
    if (data.existing_loans !== undefined) {
      setValue("existing_loans", data.existing_loans);
    }
    if (data.debt_to_income !== undefined) {
      setValue("debt_to_income", data.debt_to_income);
    }
    if (data.savings_rate !== undefined) {
      setValue("savings_rate", data.savings_rate);
    }
    if (data.investment_capacity !== undefined) {
      setValue("investment_capacity", data.investment_capacity);
    }
    if (data.insurance_coverage !== undefined) {
      setValue("insurance_coverage", data.insurance_coverage);
    }
  }, [data, setValue]);

  const onSubmit = (formData: ImprovedGoalsData) => {
    update(formData);
  };

  // Add a new financial goal
  const addGoal = () => {
    setValue("financialGoals", [
      ...financialGoals,
      { goal: "", timeline: "", targetAmount: "", priority: "" },
    ]);
  };

  // Remove a financial goal
  const removeGoal = (index: number) => {
    if (financialGoals.length > 1) {
      setValue(
        "financialGoals",
        financialGoals.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <TooltipProvider>
      <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2 mt-6">
            <Target className="h-5 w-5" />
            Financial Goals & Situation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Income and Expenses Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-teal-700 dark:text-teal-300">
                Income & Expenses
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="monthly_income"
                    className="text-base block mb-2"
                  >
                    Monthly Income (₹)
                  </Label>
                  <Input
                    id="monthly_income"
                    type="number"
                    min={0}
                    {...register("monthly_income", { valueAsNumber: true })}
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  {errors.monthly_income && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.monthly_income.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="annual_income"
                    className="text-base block mb-2"
                  >
                    Annual Income (₹)
                  </Label>
                  <Input
                    id="annual_income"
                    type="number"
                    min={0}
                    {...register("annual_income", { valueAsNumber: true })}
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  {errors.annual_income && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.annual_income.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="monthly_expenses"
                    className="text-base block mb-2"
                  >
                    Monthly Expenses (₹)
                  </Label>
                  <Input
                    id="monthly_expenses"
                    type="number"
                    min={0}
                    {...register("monthly_expenses", { valueAsNumber: true })}
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  {errors.monthly_expenses && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.monthly_expenses.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="investment_capacity"
                    className="text-base block mb-2"
                  >
                    Monthly Investment Capacity (₹)
                  </Label>
                  <Input
                    id="investment_capacity"
                    type="number"
                    min={0}
                    {...register("investment_capacity", {
                      valueAsNumber: true,
                    })}
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  {errors.investment_capacity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.investment_capacity.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Fund & Loans Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-teal-700 dark:text-teal-300">
                Emergency Fund & Loans
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="emergency_fund"
                    className="text-base block mb-2"
                  >
                    Emergency Fund Amount (₹)
                  </Label>
                  <Input
                    id="emergency_fund"
                    type="number"
                    min={0}
                    {...register("emergency_fund", { valueAsNumber: true })}
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  {errors.emergency_fund && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.emergency_fund.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="emergency_fund_months"
                    className="text-base block mb-2"
                  >
                    <FinancialTermTooltip term="emergency_fund_months">
                      Emergency Fund (Months)
                    </FinancialTermTooltip>
                  </Label>
                  <Input
                    id="emergency_fund_months"
                    type="number"
                    min={0}
                    step={0.1}
                    {...register("emergency_fund_months", {
                      valueAsNumber: true,
                    })}
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  {errors.emergency_fund_months && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.emergency_fund_months.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="savings_rate"
                    className="text-base block mb-2"
                  >
                    <FinancialTermTooltip term="savings_rate">
                      Savings Rate
                    </FinancialTermTooltip>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">
                      (0-1)
                    </span>
                  </Label>
                  <Input
                    id="savings_rate"
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    {...register("savings_rate", { valueAsNumber: true })}
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  {errors.savings_rate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.savings_rate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="debt_to_income"
                    className="text-base block mb-2"
                  >
                    <FinancialTermTooltip term="debt_to_income">
                      Debt to Income Ratio
                    </FinancialTermTooltip>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">
                      (0-1)
                    </span>
                  </Label>
                  <Input
                    id="debt_to_income"
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    {...register("debt_to_income", { valueAsNumber: true })}
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  {errors.debt_to_income && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.debt_to_income.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="insurance_coverage"
                    className="text-base block mb-2"
                  >
                    Insurance Coverage (₹)
                  </Label>
                  <Input
                    id="insurance_coverage"
                    type="number"
                    min={0}
                    {...register("insurance_coverage", { valueAsNumber: true })}
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  {errors.insurance_coverage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.insurance_coverage.message}
                    </p>
                  )}
                </div>
                <div className="space-y-3 align-middle mt-6 justify-self-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="existing_loans"
                      checked={data.existing_loans}
                      onCheckedChange={(checked) =>
                        setValue("existing_loans", checked === true)
                      }
                      className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                    />
                    <Label htmlFor="existing_loans" className="text-base">
                      Do you have existing loans?
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Goals Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-teal-700 dark:text-teal-300">
                Financial Goals
              </h3>

              {financialGoals.map((_, index) => (
                <div
                  key={index}
                  className="p-4 border border-teal-100 dark:border-teal-900/50 rounded-md bg-teal-50/50 dark:bg-teal-900/10 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-teal-700 dark:text-teal-300">
                      Goal #{index + 1}
                    </h4>
                    {financialGoals.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeGoal(index)}
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`financialGoals.${index}.goal`}>
                      Goal Description
                    </Label>
                    <Input
                      id={`financialGoals.${index}.goal`}
                      {...register(`financialGoals.${index}.goal`)}
                      placeholder="e.g., Buy a house, Retirement"
                      className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 mt-1"
                    />
                    {errors.financialGoals?.[index]?.goal && (
                      <p className="text-red-500 text-sm">
                        {errors.financialGoals[index]?.goal?.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor={`financialGoals.${index}.timeline`}>
                        Timeline
                      </Label>
                      <Select
                        onValueChange={(val) =>
                          setValue(`financialGoals.${index}.timeline`, val)
                        }
                        defaultValue={financialGoals[index]?.timeline}
                      >
                        <SelectTrigger
                          id={`financialGoals.${index}.timeline`}
                          className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 mt-1"
                        >
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="z-[100]">
                          {TIMELINE_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              <FinancialTermTooltip term={option}>
                                {option}
                              </FinancialTermTooltip>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.financialGoals?.[index]?.timeline && (
                        <p className="text-red-500 text-sm">
                          {errors.financialGoals[index]?.timeline?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`financialGoals.${index}.targetAmount`}>
                        Target Amount
                      </Label>
                      <Input
                        id={`financialGoals.${index}.targetAmount`}
                        {...register(`financialGoals.${index}.targetAmount`)}
                        placeholder="e.g., ₹50,000"
                        className="w-[100px] border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 mt-1"
                      />
                      {errors.financialGoals?.[index]?.targetAmount && (
                        <p className="text-red-500 text-sm">
                          {errors.financialGoals[index]?.targetAmount?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`financialGoals.${index}.priority`}>
                        Priority
                      </Label>
                      <Select
                        onValueChange={(val) =>
                          setValue(`financialGoals.${index}.priority`, val)
                        }
                        defaultValue={financialGoals[index]?.priority}
                      >
                        <SelectTrigger
                          id={`financialGoals.${index}.priority`}
                          className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 mt-1"
                        >
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="z-[100]">
                          {PRIORITY_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.financialGoals?.[index]?.priority && (
                        <p className="text-red-500 text-sm">
                          {errors.financialGoals[index]?.priority?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addGoal}
                className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 dark:border-teal-800 dark:text-teal-300 dark:hover:bg-teal-900/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Goal
              </Button>
            </div>

            {/* Financial Concerns */}
            <div className="space-y-3">
              <Label className="text-base block mb-2">
                What are your primary financial concerns?
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-md border border-zinc-200 dark:border-zinc-800">
                {FINANCIAL_CONCERNS.map((concern) => (
                  <div key={concern} className="flex items-center gap-2">
                    <Checkbox
                      id={concern}
                      defaultChecked={data.financialConcerns?.includes(concern)}
                      onCheckedChange={(checked) => {
                        const current = watch("financialConcerns") || [];
                        setValue(
                          "financialConcerns",
                          checked
                            ? [...current, concern]
                            : current.filter((c: string) => c !== concern)
                        );
                      }}
                      className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                    />
                    <Label htmlFor={concern} className="cursor-pointer">
                      <FinancialTermTooltip term={concern}>
                        {concern}
                      </FinancialTermTooltip>
                    </Label>
                  </div>
                ))}
              </div>
              {errors.financialConcerns && (
                <p className="text-red-500 text-sm">
                  {errors.financialConcerns.message}
                </p>
              )}
            </div>

            {/* Current Financial Behavior */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-teal-700 dark:text-teal-300">
                Additional Financial Information
              </h3>

              <div>
                <Label htmlFor="existingDebts">Existing Debts (if any)</Label>
                <Textarea
                  id="existingDebts"
                  {...register("existingDebts")}
                  placeholder="e.g., Mortgage: ₹200,000, Car Loan: ₹15,000"
                  className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 mt-1"
                />
                {errors.existingDebts && (
                  <p className="text-red-500 text-sm">
                    {errors.existingDebts.message}
                  </p>
                )}
              </div>
            </div>

            {/* Financial Knowledge Self-Assessment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-teal-700 dark:text-teal-300">
                Financial Knowledge
              </h3>

              <div>
                <Label htmlFor="knowledgeLevel">
                  How would you rate your financial knowledge?
                </Label>
                <Select
                  onValueChange={(val) => setValue("knowledgeLevel", val)}
                  defaultValue={data.knowledgeLevel}
                >
                  <SelectTrigger
                    id="knowledgeLevel"
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 mt-1"
                  >
                    <SelectValue placeholder="Select knowledge level" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="z-[100]">
                    {KNOWLEDGE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        <FinancialTermTooltip term={level}>
                          {level}
                        </FinancialTermTooltip>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.knowledgeLevel && (
                  <p className="text-red-500 text-sm">
                    {errors.knowledgeLevel.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="willingnessToLearn">
                  How willing are you to learn about new investment strategies?
                </Label>
                <Textarea
                  id="willingnessToLearn"
                  {...register("willingnessToLearn")}
                  placeholder="Describe your interest in financial education"
                  className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 mt-1"
                />
                {errors.willingnessToLearn && (
                  <p className="text-red-500 text-sm">
                    {errors.willingnessToLearn.message}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Context */}
            <div>
              <Label htmlFor="extraContext">
                Anything else you'd like to share about your financial
                situation?
              </Label>
              <Textarea
                id="extraContext"
                {...register("extraContext")}
                placeholder="e.g., Expecting inheritance, Planning career change, etc."
                className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 mt-6"
            >
              Finish
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
