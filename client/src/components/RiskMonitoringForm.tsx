"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"
import { FinancialTermTooltip } from "@/components/FinancialTermTooltip"
import { ArrowRight, LineChart } from 'lucide-react'
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  investmentDuration: z.string().min(1, "Please select an investment duration"),
  monitoringFrequency: z.string().min(1, "Please select a monitoring frequency"),
  expectedReturns: z.string().min(1, "Please select an expected return range"),
  investmentFactors: z.array(z.string()).min(1, "Select at least one factor"),
  investment_horizon_years: z.number().min(1).max(50),
  expected_return: z.number().min(1).max(30),
  short_term: z.boolean().optional(),
  medium_term: z.boolean().optional(),
  long_term: z.boolean().optional(),
  tax_bracket: z.string().min(1, "Please select your tax bracket"),
})

const FACTORS = ["Risk", "Liquidity", "Return", "Tax Benefit", "Investment Tenure", "Market Trends"]

// Define the type for the form data
export type RiskMonitoringData = z.infer<typeof formSchema>

// Define the props interface for the component
interface RiskMonitoringFormProps {
  data: Partial<RiskMonitoringData>
  update: (data: RiskMonitoringData) => void
}

export function RiskMonitoringForm({ data, update }: RiskMonitoringFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RiskMonitoringData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentDuration: data.investmentDuration || "",
      monitoringFrequency: data.monitoringFrequency || "",
      expectedReturns: data.expectedReturns || "",
      investmentFactors: data.investmentFactors || [],
      investment_horizon_years: data.investment_horizon_years || 10,
      expected_return: data.expected_return || 12,
      short_term: data.short_term || false,
      medium_term: data.medium_term || false,
      long_term: data.long_term || false,
      tax_bracket: data.tax_bracket || "",
    },
    mode: "onChange",
  })

  // Pre-fill form with existing data
  useEffect(() => {
    if (data.investmentDuration) {
      setValue("investmentDuration", data.investmentDuration)
    }
    if (data.monitoringFrequency) {
      setValue("monitoringFrequency", data.monitoringFrequency)
    }
    if (data.expectedReturns) {
      setValue("expectedReturns", data.expectedReturns)
    }
    if (data.investmentFactors && data.investmentFactors.length > 0) {
      setValue("investmentFactors", data.investmentFactors)
    }
    if (data.investment_horizon_years !== undefined) {
      setValue("investment_horizon_years", data.investment_horizon_years)
    }
    if (data.expected_return !== undefined) {
      setValue("expected_return", data.expected_return)
    }
    if (data.short_term !== undefined) {
      setValue("short_term", data.short_term)
    }
    if (data.medium_term !== undefined) {
      setValue("medium_term", data.medium_term)
    }
    if (data.long_term !== undefined) {
      setValue("long_term", data.long_term)
    }
    if (data.tax_bracket) {
      setValue("tax_bracket", data.tax_bracket)
    }
  }, [data, setValue])

  const onSubmit = (formData: RiskMonitoringData) => {
    update(formData)
  }

  return (
    <TooltipProvider>
      <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Risk & Monitoring Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Investment Horizon Years */}
            <div className="space-y-3">
              <Label htmlFor="investment_horizon_years" className="text-base block mb-2">
                Investment Horizon (Years)
              </Label>
              <Input
                id="investment_horizon_years"
                type="number"
                min={1}
                max={50}
                {...register("investment_horizon_years", { valueAsNumber: true })}
                className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
              />
              {errors.investment_horizon_years && (
                <p className="text-red-500 text-sm mt-1">{errors.investment_horizon_years.message}</p>
              )}
            </div>

            {/* Expected Return */}
            <div className="space-y-3">
              <Label htmlFor="expected_return" className="text-base block mb-2">
                Expected Annual Return (%)
              </Label>
              <Input
                id="expected_return"
                type="number"
                min={1}
                max={30}
                step={0.1}
                {...register("expected_return", { valueAsNumber: true })}
                className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
              />
              {errors.expected_return && (
                <p className="text-red-500 text-sm mt-1">{errors.expected_return.message}</p>
              )}
            </div>

            {/* Tax Bracket */}
            <div className="space-y-3">
              <Label htmlFor="tax_bracket" className="text-base block mb-2">
                Tax Bracket
              </Label>
              <Select
                defaultValue={data.tax_bracket}
                onValueChange={(val) => setValue("tax_bracket", val)}
              >
                <SelectTrigger
                  id="tax_bracket"
                  className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                >
                  <SelectValue placeholder="Select tax bracket" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {["5%", "10%", "15%", "20%", "30%"].map((bracket) => (
                    <SelectItem key={bracket} value={bracket}>
                      <FinancialTermTooltip term={bracket}>{bracket}</FinancialTermTooltip>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tax_bracket && <p className="text-red-500 text-sm mt-1">{errors.tax_bracket.message}</p>}
            </div>

            {/* Investment Time Horizons */}
            <div className="space-y-3">
              <Label className="text-base block mb-2">Investment Time Horizons</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="short_term"
                    checked={data.short_term}
                    onCheckedChange={(checked) => setValue("short_term", checked === true)}
                    className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  <Label htmlFor="short_term" className="cursor-pointer">
                    <FinancialTermTooltip term="short_term">Short Term (1-3 years)</FinancialTermTooltip>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medium_term"
                    checked={data.medium_term}
                    onCheckedChange={(checked) => setValue("medium_term", checked === true)}
                    className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  <Label htmlFor="medium_term" className="cursor-pointer">
                    <FinancialTermTooltip term="medium_term">Medium Term (3-7 years)</FinancialTermTooltip>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="long_term"
                    checked={data.long_term}
                    onCheckedChange={(checked) => setValue("long_term", checked === true)}
                    className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  <Label htmlFor="long_term" className="cursor-pointer">
                    <FinancialTermTooltip term="long_term">Long Term (7+ years)</FinancialTermTooltip>
                  </Label>
                </div>
              </div>
            </div>

            {/* Investment Duration */}
            <div className="space-y-3">
              <Label className="text-base block mb-2">How long do you prefer to keep your money invested?</Label>
              <Select
                defaultValue={data.investmentDuration}
                onValueChange={(val) => setValue("investmentDuration", val)}
              >
                <SelectTrigger className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {["< 1 year", "1-3 years", "3-5 years", "5+ years"].map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      <FinancialTermTooltip term={opt}>{opt}</FinancialTermTooltip>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.investmentDuration && (
                <p className="text-red-500 text-sm mt-1">{errors.investmentDuration.message}</p>
              )}
            </div>

            {/* Monitoring Frequency */}
            <div className="space-y-3">
              <Label className="text-base block mb-2">How often do you monitor your investments?</Label>
              <Select
                defaultValue={data.monitoringFrequency}
                onValueChange={(val) => setValue("monitoringFrequency", val)}
              >
                <SelectTrigger className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {["Daily", "Weekly", "Monthly", "Rarely"].map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      <FinancialTermTooltip term={opt}>{opt}</FinancialTermTooltip>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.monitoringFrequency && (
                <p className="text-red-500 text-sm mt-1">{errors.monitoringFrequency.message}</p>
              )}
            </div>

            {/* Expected Returns */}
            <div className="space-y-3">
              <Label className="text-base block mb-2">Expected Returns from Investment (%)</Label>
              <Select defaultValue={data.expectedReturns} onValueChange={(val) => setValue("expectedReturns", val)}>
                <SelectTrigger className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400">
                  <SelectValue placeholder="Select return range" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {["< 5%", "5%-10%", "10%-15%", "> 15%"].map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      <FinancialTermTooltip term={opt}>{opt}</FinancialTermTooltip>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.expectedReturns && <p className="text-red-500 text-sm mt-1">{errors.expectedReturns.message}</p>}
            </div>

            {/* Investment Factors */}
            <div className="space-y-3">
              <Label className="text-base block mb-2">Factors considered while investing</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-md border border-zinc-200 dark:border-zinc-800">
                {FACTORS.map((factor) => (
                  <div key={factor} className="flex items-center gap-2">
                    <Checkbox
                      id={factor}
                      defaultChecked={data.investmentFactors?.includes(factor)}
                      onCheckedChange={(checked) => {
                        const current = watch("investmentFactors") || []
                        setValue(
                          "investmentFactors",
                          checked ? [...current, factor] : current.filter((val: string) => val !== factor),
                        )
                      }}
                      className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                    />
                    <Label htmlFor={factor} className="cursor-pointer">
                      <FinancialTermTooltip term={factor}>{factor}</FinancialTermTooltip>
                    </Label>
                  </div>
                ))}
              </div>
              {errors.investmentFactors && (
                <p className="text-red-500 text-sm mt-1">{errors.investmentFactors.message}</p>
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
  