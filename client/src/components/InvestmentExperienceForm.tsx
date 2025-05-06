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
import { ArrowRight } from 'lucide-react'

const formSchema = z.object({
  investInAvenues: z.enum(["Yes", "No"], {
    required_error: "Please select if you invest in investment avenues",
  }),
  investInStockMarket: z.enum(["Yes", "No"], {
    required_error: "Please select if you invest in the stock market",
  }),
  mostlyInvestIn: z.string().min(1, "Please select an investment avenue"),
  investmentObjectives: z.array(z.string()).min(1, "Select at least one objective"),
})

const OBJECTIVES = [
  "Wealth Creation",
  "Retirement",
  "Tax Saving",
  "Children's Education",
  "Emergency Fund",
]

// Define the type for the form data
export type InvestmentExperienceData = z.infer<typeof formSchema>

// Define the props interface for the component
interface InvestmentExperienceFormProps {
  data: Partial<InvestmentExperienceData>;
  update: (data: InvestmentExperienceData) => void;
}

export function InvestmentExperienceForm({ data, update }: InvestmentExperienceFormProps) {
  const {
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
    },
  })

  // Pre-fill form with existing data
  useEffect(() => {
    if (data.investInAvenues) {
      setValue("investInAvenues", data.investInAvenues);
    }
    if (data.investInStockMarket) {
      setValue("investInStockMarket", data.investInStockMarket);
    }
    if (data.mostlyInvestIn) {
      setValue("mostlyInvestIn", data.mostlyInvestIn);
    }
    if (data.investmentObjectives && data.investmentObjectives.length > 0) {
      setValue("investmentObjectives", data.investmentObjectives);
    }
  }, [data, setValue]);

  const onSubmit = (formData: InvestmentExperienceData) => {
    update(formData);
  }

  return (
    <TooltipProvider>
      <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-xl text-teal-800 dark:text-teal-300">Investment Experience</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Invest in Avenues */}
            <div className="space-y-3">
              <Label className="text-base">Do you invest in investment avenues?</Label>
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
              {errors.investInAvenues && (
                <p className="text-red-500 text-sm mt-1">{errors.investInAvenues.message}</p>
              )}
            </div>

            {/* Invest in Stock Market */}
            <div className="space-y-3">
              <Label className="text-base">Do you invest in the stock market?</Label>
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

            {/* Mostly Invest In */}
            <div className="space-y-3">
              <Label className="text-base">Which investment avenue do you mostly invest in?</Label>
              <Select 
                defaultValue={data.mostlyInvestIn}
                onValueChange={(val) => setValue("mostlyInvestIn", val)}
              >
                <SelectTrigger className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {["Mutual Funds", "Equity", "Gold", "Fixed Deposits", "PPF"].map((item) => (
                    <SelectItem key={item} value={item}>
                      <FinancialTermTooltip term={item}>{item}</FinancialTermTooltip>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mostlyInvestIn && (
                <p className="text-red-500 text-sm mt-1">{errors.mostlyInvestIn.message}</p>
              )}
            </div>

            {/* Investment Objectives */}
            <div className="space-y-3">
              <Label className="text-base">What is your investment objective?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-md border border-zinc-200 dark:border-zinc-800">
                {OBJECTIVES.map((obj) => (
                  <div key={obj} className="flex items-center gap-2">
                    <Checkbox
                      id={obj}
                      defaultChecked={data.investmentObjectives?.includes(obj)}
                      onCheckedChange={(checked) => {
                        const current = watch("investmentObjectives") || [];
                        setValue(
                          "investmentObjectives",
                          checked
                            ? [...current, obj]
                            : current.filter((val: string) => val !== obj)
                        );
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
