import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"
import { FinancialTermTooltip } from "@/components/FinancialTermTooltip"
import { ArrowRight, Target, Plus, Trash2 } from 'lucide-react'

const formSchema = z.object({
  // Financial Goals with Timeline and Priority
  financialGoals: z.array(
    z.object({
      goal: z.string().min(2, "Goal name is required"),
      timeline: z.string().min(1, "Timeline is required"),
      targetAmount: z.string().min(1, "Target amount is required"),
      priority: z.string().min(1, "Priority is required"),
    })
  ).min(1, "At least one financial goal is required"),
  
  // Key Financial Concerns
  financialConcerns: z.array(z.string()).min(1, "Select at least one financial concern"),
  
  // Current Financial Behavior
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  monthlySavings: z.string().min(1, "Monthly savings is required"),
  existingDebts: z.string(),
  
  // Financial Knowledge Self-Assessment
  knowledgeLevel: z.string().min(1, "Knowledge level is required"),
  willingnessToLearn: z.string().min(1, "This field is required"),
  
  // Additional Context
  extraContext: z.string().optional(),
})

const TIMELINE_OPTIONS = [
  "< 1 Year",
  "1-3 Years",
  "3-5 Years",
  "5-10 Years",
  "10+ Years"
]

const PRIORITY_OPTIONS = [
  "Critical",
  "High",
  "Medium",
  "Low"
]

const FINANCIAL_CONCERNS = [
  "Market Volatility",
  "Inflation",
  "Unexpected Expenses",
  "Job Security",
  "Health Costs",
  "Retirement Adequacy",
  "Tax Burden",
  "Debt Management"
]

const KNOWLEDGE_LEVELS = [
  "Beginner - New to investing",
  "Basic - Understand fundamental concepts",
  "Intermediate - Comfortable with most investment products",
  "Advanced - Understand complex investment strategies",
  "Expert - Professional experience in finance"
]

// Define the type for the form data
export type ImprovedGoalsData = z.infer<typeof formSchema>

// Define the props interface for the component
interface ImprovedGoalsReasonsFormProps {
  data: Partial<ImprovedGoalsData>;
  update: (data: ImprovedGoalsData) => void;
}

export function ImprovedGoalsReasonsForm({ data, update }: ImprovedGoalsReasonsFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ImprovedGoalsData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financialGoals: data.financialGoals || [{ goal: "", timeline: "", targetAmount: "", priority: "" }],
      financialConcerns: data.financialConcerns || [],
      monthlyIncome: data.monthlyIncome || "",
      monthlySavings: data.monthlySavings || "",
      existingDebts: data.existingDebts || "",
      knowledgeLevel: data.knowledgeLevel || "",
      willingnessToLearn: data.willingnessToLearn || "",
      extraContext: data.extraContext || "",
    },
  })

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
    if (data.monthlyIncome) {
      setValue("monthlyIncome", data.monthlyIncome);
    }
    if (data.monthlySavings) {
      setValue("monthlySavings", data.monthlySavings);
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
  }, [data, setValue]);

  const onSubmit = (formData: ImprovedGoalsData) => {
    update(formData);
  }

  // Add a new financial goal
  const addGoal = () => {
    setValue("financialGoals", [
      ...financialGoals, 
      { goal: "", timeline: "", targetAmount: "", priority: "" }
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
          <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Financial Goals & Situation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Financial Goals Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-teal-700 dark:text-teal-300">Financial Goals</h3>
              
              {financialGoals.map((_, index) => (
                <div 
                  key={index} 
                  className="p-4 border border-teal-100 dark:border-teal-900/50 rounded-md bg-teal-50/50 dark:bg-teal-900/10 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-teal-700 dark:text-teal-300">Goal #{index + 1}</h4>
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
                    <Label htmlFor={`financialGoals.${index}.goal`}>Goal Description</Label>
                    <Input
                      id={`financialGoals.${index}.goal`}
                      {...register(`financialGoals.${index}.goal`)}
                      placeholder="e.g., Buy a house, Retirement"
                      className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                    />
                    {errors.financialGoals?.[index]?.goal && (
                      <p className="text-red-500 text-sm">{errors.financialGoals[index]?.goal?.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor={`financialGoals.${index}.timeline`}>Timeline</Label>
                      <Select
                        onValueChange={(val) => setValue(`financialGoals.${index}.timeline`, val)}
                        defaultValue={financialGoals[index]?.timeline}
                      >
                        <SelectTrigger 
                          id={`financialGoals.${index}.timeline`}
                          className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                        >
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMELINE_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              <FinancialTermTooltip term={option}>{option}</FinancialTermTooltip>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.financialGoals?.[index]?.timeline && (
                        <p className="text-red-500 text-sm">{errors.financialGoals[index]?.timeline?.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor={`financialGoals.${index}.targetAmount`}>Target Amount</Label>
                      <Input
                        id={`financialGoals.${index}.targetAmount`}
                        {...register(`financialGoals.${index}.targetAmount`)}
                        placeholder="e.g., $50,000"
                        className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                      />
                      {errors.financialGoals?.[index]?.targetAmount && (
                        <p className="text-red-500 text-sm">{errors.financialGoals[index]?.targetAmount?.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor={`financialGoals.${index}.priority`}>Priority</Label>
                      <Select
                        onValueChange={(val) => setValue(`financialGoals.${index}.priority`, val)}
                        defaultValue={financialGoals[index]?.priority}
                      >
                        <SelectTrigger 
                          id={`financialGoals.${index}.priority`}
                          className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                        >
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.financialGoals?.[index]?.priority && (
                        <p className="text-red-500 text-sm">{errors.financialGoals[index]?.priority?.message}</p>
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
              <Label className="text-base">What are your primary financial concerns?</Label>
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
                      <FinancialTermTooltip term={concern}>{concern}</FinancialTermTooltip>
                    </Label>
                  </div>
                ))}
              </div>
              {errors.financialConcerns && (
                <p className="text-red-500 text-sm">{errors.financialConcerns.message}</p>
              )}
            </div>

            {/* Current Financial Behavior */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-teal-700 dark:text-teal-300">Current Financial Situation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Income</Label>
                  <Input
                    id="monthlyIncome"
                    {...register("monthlyIncome")}
                    placeholder="e.g., $5,000"
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  {errors.monthlyIncome && (
                    <p className="text-red-500 text-sm">{errors.monthlyIncome.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="monthlySavings">Monthly Savings</Label>
                  <Input
                    id="monthlySavings"
                    {...register("monthlySavings")}
                    placeholder="e.g., $1,000"
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  {errors.monthlySavings && (
                    <p className="text-red-500 text-sm">{errors.monthlySavings.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="existingDebts">Existing Debts (if any)</Label>
                <Textarea
                  id="existingDebts"
                  {...register("existingDebts")}
                  placeholder="e.g., Mortgage: $200,000, Car Loan: $15,000"
                  className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                />
                {errors.existingDebts && (
                  <p className="text-red-500 text-sm">{errors.existingDebts.message}</p>
                )}
              </div>
            </div>

            {/* Financial Knowledge Self-Assessment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-teal-700 dark:text-teal-300">Financial Knowledge</h3>
              
              <div>
                <Label htmlFor="knowledgeLevel">How would you rate your financial knowledge?</Label>
                <Select
                  onValueChange={(val) => setValue("knowledgeLevel", val)}
                  defaultValue={data.knowledgeLevel}
                >
                  <SelectTrigger 
                    id="knowledgeLevel"
                    className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                  >
                    <SelectValue placeholder="Select knowledge level" />
                  </SelectTrigger>
                  <SelectContent>
                    {KNOWLEDGE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        <FinancialTermTooltip term={level}>{level}</FinancialTermTooltip>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.knowledgeLevel && (
                  <p className="text-red-500 text-sm">{errors.knowledgeLevel.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="willingnessToLearn">How willing are you to learn about new investment strategies?</Label>
                <Textarea
                  id="willingnessToLearn"
                  {...register("willingnessToLearn")}
                  placeholder="Describe your interest in financial education"
                  className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                />
                {errors.willingnessToLearn && (
                  <p className="text-red-500 text-sm">{errors.willingnessToLearn.message}</p>
                )}
              </div>
            </div>

            {/* Additional Context */}
            <div>
              <Label htmlFor="extraContext">Anything else you'd like to share about your financial situation?</Label>
              <Textarea
                id="extraContext"
                {...register("extraContext")}
                placeholder="e.g., Expecting inheritance, Planning career change, etc."
                className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
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
  )
}
