"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"
import { FinancialTermTooltip } from "@/components/FinancialTermTooltip"
import { ArrowRight, Sliders } from 'lucide-react'
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  investInAvenues: z.enum(["Yes", "No"], {
    required_error: "Please select if you invest in investment avenues",
  }),
  investInStockMarket: z.enum(["Yes", "No"], {
    required_error: "Please select if you invest in the stock market",
  }),
  mostlyInvestIn: z.string().min(1, "Please select an investment avenue"),
  investmentObjectives: z.array(z.string()).min(1, "Select at least one objective"),
  investment_experience_years: z.number().min(0).max(50),
  investment_knowledge: z.number().min(1).max(10),
  investment_preference: z.string().min(1, "Please select your investment preference"),
  prefers_tax_saving: z.boolean().optional(),
  risk_tolerance_self_reported: z.number().min(1).max(10),
  existing_investments: z.number().min(0),
})

const OBJECTIVES = ["Wealth Creation", "Retirement", "Tax Saving", "Children's Education", "Emergency Fund"]

// Define the type for the form data
export type InvestmentExperienceData = z.infer<typeof formSchema>

// Define the props interface for the component
interface InvestmentExperienceFormProps {
  data: Partial<InvestmentExperienceData>
  update: (data: InvestmentExperienceData) => void
}

export function InvestmentExperienceForm({ data, update }: InvestmentExperienceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvestmentExperienceData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investInAvenues: data.investInAvenues || undefined,
      investInStockMarket: data.investInStockMarket || undefined,
      mostlyInvestIn: data.mostlyInvestIn || "",
      investmentObjectives: data.investmentObjectives || [],
      investment_experience_years: data.investment_experience_years || 0,
      investment_knowledge: data.investment_knowledge || 5,
      investment_preference: data.investment_preference || "",
      prefers_tax_saving: data.prefers_tax_saving || false,
      risk_tolerance_self_reported: data.risk_tolerance_self_reported || 5,
      existing_investments: data.existing_investments || 0,
    },
  })

  // Pre-fill form with existing data
  useEffect(() => {
    if (data.investInAvenues) {
      setValue("investInAvenues", data.investInAvenues)
    }
    if (data.investInStockMarket) {
      setValue("investInStockMarket", data.investInStockMarket)
    }
    if (data.mostlyInvestIn) {
      setValue("mostlyInvestIn", data.mostlyInvestIn)
    }
    if (data.investmentObjectives && data.investmentObjectives.length > 0) {
      setValue("investmentObjectives", data.investmentObjectives)
    }
    if (data.investment_experience_years !== undefined) {
      setValue("investment_experience_years", data.investment_experience_years)
    }
    if (data.investment_knowledge !== undefined) {
      setValue("investment_knowledge", data.investment_knowledge)
    }
    if (data.investment_preference) {
      setValue("investment_preference", data.investment_preference)
    }
    if (data.prefers_tax_saving !== undefined) {
      setValue("prefers_tax_saving", data.prefers_tax_saving)
    }
    if (data.risk_tolerance_self_reported !== undefined) {
      setValue("risk_tolerance_self_reported", data.risk_tolerance_self_reported)
    }
    if (data.existing_investments !== undefined) {
      setValue("existing_investments", data.existing_investments)
    }
  }, [data, setValue])

  const onSubmit = (formData: InvestmentExperienceData) => {
    update(formData)
  }

  return (
    <TooltipProvider>
      <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2 mt-6">
            <Sliders className="h-5 w-5" />
            Investment Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Investment Experience Years */}
            <div className="space-y-3">
              <Label htmlFor="investment_experience_years" className="text-base block mb-2">
                Years of Investment Experience
              </Label>
              <Input
                id="investment_experience_years"
                type="number"
                min={0}
                max={50}
                {...register("investment_experience_years", { valueAsNumber: true })}
                className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
              />
              {errors.investment_experience_years && (
                <p className="text-red-500 text-sm mt-1">{errors.investment_experience_years.message}</p>
              )}
            </div>

            {/* Investment Knowledge */}
            <div className="space-y-3">
              <Label htmlFor="investment_knowledge" className="text-base block mb-2">
                Investment Knowledge (1-10)
                <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">
                  (1: Beginner, 10: Expert)
                </span>
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="investment_knowledge"
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  {...register("investment_knowledge", { valueAsNumber: true })}
                  className="w-full"
                />
                <span className="font-medium text-lg min-w-[2ch] text-center">
                  {watch("investment_knowledge")}
                </span>
              </div>
              {errors.investment_knowledge && (
                <p className="text-red-500 text-sm mt-1">{errors.investment_knowledge.message}</p>
              )}
            </div>

            {/* Risk Tolerance */}
            <div className="space-y-3">
              <Label htmlFor="risk_tolerance_self_reported" className="text-base block mb-2">
                <FinancialTermTooltip term="risk_tolerance">Risk Tolerance (1-10)</FinancialTermTooltip>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">
                  (1: Very Conservative, 10: Very Aggressive)
                </span>
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="risk_tolerance_self_reported"
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  {...register("risk_tolerance_self_reported", { valueAsNumber: true })}
                  className="w-full"
                />
                <span className="font-medium text-lg min-w-[2ch] text-center">
                  {watch("risk_tolerance_self_reported")}
                </span>
              </div>
              {errors.risk_tolerance_self_reported && (
                <p className="text-red-500 text-sm mt-1">{errors.risk_tolerance_self_reported.message}</p>
              )}
            </div>

            {/* Existing Investments */}
            <div className="space-y-3">
              <Label htmlFor="existing_investments" className="text-base block mb-2">
                Total Value of Existing Investments (₹)
              </Label>
              <Input
                id="existing_investments"
                type="number"
                min={0}
                {...register("existing_investments", { valueAsNumber: true })}
                className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
              />
              {errors.existing_investments && (
                <p className="text-red-500 text-sm mt-1">{errors.existing_investments.message}</p>
              )}
            </div>

            {/* Invest in Avenues */}
            <div className="space-y-3">
              <Label className="text-base block mb-2">Do you invest in investment avenues?</Label>
              <RadioGroup
                defaultValue={data.investInAvenues}
                onValueChange={(val) => setValue("investInAvenues", val as "Yes" | "No")}
                className="flex gap-6"
              >
                {["Yes", "No"].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option}
                      id={`avenues-${option}`}
                      className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                    />
                    <Label htmlFor={`avenues-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.investInAvenues && <p className="text-red-500 text-sm mt-1">{errors.investInAvenues.message}</p>}
            </div>

            {/* Invest in Stock Market */}
            <div className="space-y-3">
              <Label className="text-base block mb-2">Do you invest in the stock market?</Label>
              <RadioGroup
                defaultValue={data.investInStockMarket}
                onValueChange={(val) => setValue("investInStockMarket", val as "Yes" | "No")}
                className="flex gap-6"
              >
                {["Yes", "No"].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option}
                      id={`stock-${option}`}
                      className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                    />
                    <Label htmlFor={`stock-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.investInStockMarket && (
                <p className="text-red-500 text-sm mt-1">{errors.investInStockMarket.message}</p>
              )}
            </div>

            {/* Investment Preference */}
            <div className="space-y-3">
              <Label htmlFor="investment_preference" className="text-base block mb-2">
                Investment Preference
              </Label>
              <Select
                defaultValue={data.investment_preference}
                onValueChange={(val) => setValue("investment_preference", val)}
              >
                <SelectTrigger
                  id="investment_preference"
                  className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                >
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {["equity", "debt", "gold", "real_estate", "balanced"].map((pref) => (
                    <SelectItem key={pref} value={pref}>
                      {pref.charAt(0).toUpperCase() + pref.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.investment_preference && (
                <p className="text-red-500 text-sm mt-1">{errors.investment_preference.message}</p>
              )}
            </div>

            {/* Mostly Invest In */}
            <div className="space-y-3">
              <Label htmlFor="mostlyInvestIn" className="text-base block mb-2">
                Which investment avenue do you mostly invest in?
              </Label>
              <Select defaultValue={data.mostlyInvestIn} onValueChange={(val) => setValue("mostlyInvestIn", val)}>
                <SelectTrigger
                  id="mostlyInvestIn"
                  className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                >
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {["Mutual Funds", "Equity", "Gold", "Fixed Deposits", "PPF"].map((item) => (
                    <SelectItem key={item} value={item}>
                      <FinancialTermTooltip term={item}>{item}</FinancialTermTooltip>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mostlyInvestIn && <p className="text-red-500 text-sm mt-1">{errors.mostlyInvestIn.message}</p>}
            </div>

            {/* Prefers Tax Saving */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prefers_tax_saving"
                  checked={data.prefers_tax_saving}
                  onCheckedChange={(checked) => setValue("prefers_tax_saving", checked === true)}
                  className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                />
                <Label htmlFor="prefers_tax_saving" className="text-base">
                  Do you prefer tax-saving investments?
                </Label>
              </div>
            </div>

            {/* Investment Objectives */}
            <div className="space-y-3">
              <Label className="text-base block mb-2">What is your investment objective?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-md border border-zinc-200 dark:border-zinc-800">
                {OBJECTIVES.map((obj) => (
                  <div key={obj} className="flex items-center gap-2">
                    <Checkbox
                      id={obj}
                      defaultChecked={data.investmentObjectives?.includes(obj)}
                      onCheckedChange={(checked) => {
                        const current = watch("investmentObjectives") || []
                        setValue(
                          "investmentObjectives",
                          checked ? [...current, obj] : current.filter((val: string) => val !== obj),
                        )
                      }}
                      className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                    />
                    <Label htmlFor={obj} className="cursor-pointer">
                      <FinancialTermTooltip term={obj}>{obj}</FinancialTermTooltip>
                    </Label>
                  </div>
                ))}
              </div>
              {errors.investmentObjectives && (
                <p className="text-red-500 text-sm mt-1">{errors.investmentObjectives.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 mt-6"
            >
              Save & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
