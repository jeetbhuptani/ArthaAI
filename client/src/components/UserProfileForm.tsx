"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, User } from 'lucide-react'
import { TooltipProvider } from "@/components/ui/tooltip"
import { FinancialTermTooltip } from "@/components/FinancialTermTooltip"

// Define the form schema for validation
const formSchema = z.object({
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select your gender",
  }),
  age: z.number().min(10).max(100),
  marital_status: z.string().min(1, "Please select your marital status"),
  education_level: z.string().min(1, "Please select your education level"),
  has_dependents: z.boolean().optional(),
  tier_city: z.string().min(1, "Please select your city tier"),
  life_stage: z.string().min(1, "Please select your life stage"),
  salaried_employee: z.boolean().optional(),
})

// Define the type for the form data
export type UserProfileData = z.infer<typeof formSchema>

// Define the props interface for the component
interface UserProfileFormProps {
  data: Partial<UserProfileData>
  update: (data: UserProfileData) => void
}

export function UserProfileForm({ data, update }: UserProfileFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserProfileData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: (data.gender as "Male" | "Female" | "Other") || undefined,
      age: data.age || 30,
      marital_status: data.marital_status || "",
      education_level: data.education_level || "",
      has_dependents: data.has_dependents || false,
      tier_city: data.tier_city || "",
      life_stage: data.life_stage || "",
      salaried_employee: data.salaried_employee || false,
    },
  })

  // Pre-fill form with existing data
  useEffect(() => {
    if (data.gender) {
      setValue("gender", data.gender as "Male" | "Female" | "Other")
    }
    if (data.age) {
      setValue("age", data.age)
    }
    if (data.marital_status) {
      setValue("marital_status", data.marital_status)
    }
    if (data.education_level) {
      setValue("education_level", data.education_level)
    }
    if (data.has_dependents !== undefined) {
      setValue("has_dependents", data.has_dependents)
    }
    if (data.tier_city) {
      setValue("tier_city", data.tier_city)
    }
    if (data.life_stage) {
      setValue("life_stage", data.life_stage)
    }
    if (data.salaried_employee !== undefined) {
      setValue("salaried_employee", data.salaried_employee)
    }
  }, [data, setValue])

  const onSubmit = (formData: UserProfileData) => {
    update(formData)
  }

  return (
    <TooltipProvider>
      <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2 mt-6">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Gender */}
            <div className="space-y-3">
              <Label className="text-base block mb-2">Gender</Label>
              <RadioGroup
                defaultValue={data.gender}
                onValueChange={(val) => setValue("gender", val as "Male" | "Female" | "Other")}
                className="flex flex-wrap gap-6"
              >
                {["Male", "Female", "Other"].map((g) => (
                  <div key={g} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={g}
                      id={g}
                      className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                    />
                    <Label htmlFor={g}>{g}</Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
            </div>

            {/* Age */}
            <div className="space-y-3">
              <Label htmlFor="age" className="text-base block mb-2">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                min={10}
                max={100}
                {...register("age", { valueAsNumber: true })}
                className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
            </div>

            {/* Marital Status */}
            <div className="space-y-3">
              <Label htmlFor="marital_status" className="text-base block mb-2">
                Marital Status
              </Label>
              <Select
                defaultValue={data.marital_status}
                onValueChange={(val) => setValue("marital_status", val)}
              >
                <SelectTrigger
                  id="marital_status"
                  className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                >
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {["single", "married", "divorced", "widowed"].map((status) => (
                    <SelectItem key={status} value={status}>
                      <FinancialTermTooltip term={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </FinancialTermTooltip>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.marital_status && <p className="text-red-500 text-sm mt-1">{errors.marital_status.message}</p>}
            </div>

            {/* Education Level */}
            <div className="space-y-3">
              <Label htmlFor="education_level" className="text-base block mb-2">
                Education Level
              </Label>
              <Select
                defaultValue={data.education_level}
                onValueChange={(val) => setValue("education_level", val)}
              >
                <SelectTrigger
                  id="education_level"
                  className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                >
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {["high_school", "undergraduate", "graduate", "doctorate"].map((level) => (
                    <SelectItem key={level} value={level}>
                      <FinancialTermTooltip term={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1).replace('_', ' ')}
                      </FinancialTermTooltip>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.education_level && <p className="text-red-500 text-sm mt-1">{errors.education_level.message}</p>}
            </div>

            {/* City Tier */}
            <div className="space-y-3">
              <Label htmlFor="tier_city" className="text-base block mb-2">
                City Tier
              </Label>
              <Select
                defaultValue={data.tier_city}
                onValueChange={(val) => setValue("tier_city", val)}
              >
                <SelectTrigger
                  id="tier_city"
                  className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                >
                  <SelectValue placeholder="Select city tier" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {["Tier 1", "Tier 2", "Tier 3"].map((tier) => (
                    <SelectItem key={tier} value={tier}>
                      <FinancialTermTooltip term={tier}>{tier}</FinancialTermTooltip>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tier_city && <p className="text-red-500 text-sm mt-1">{errors.tier_city.message}</p>}
            </div>

            {/* Life Stage */}
            <div className="space-y-3">
              <Label htmlFor="life_stage" className="text-base block mb-2">
                Life Stage
              </Label>
              <Select
                defaultValue={data.life_stage}
                onValueChange={(val) => setValue("life_stage", val)}
              >
                <SelectTrigger
                  id="life_stage"
                  className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
                >
                  <SelectValue placeholder="Select life stage" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {["starting", "growing", "established", "pre_retirement", "retirement"].map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      <FinancialTermTooltip term={stage}>
                        {stage.charAt(0).toUpperCase() + stage.slice(1).replace('_', ' ')}
                      </FinancialTermTooltip>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.life_stage && <p className="text-red-500 text-sm mt-1">{errors.life_stage.message}</p>}
            </div>

            {/* Has Dependents */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has_dependents"
                  checked={data.has_dependents}
                  onCheckedChange={(checked) => setValue("has_dependents", checked === true)}
                  className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                />
                <Label htmlFor="has_dependents" className="text-base">
                  Do you have dependents? (children, elderly parents, etc.)
                </Label>
              </div>
            </div>

            {/* Salaried Employee */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="salaried_employee"
                  checked={data.salaried_employee}
                  onCheckedChange={(checked) => setValue("salaried_employee", checked === true)}
                  className="border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                />
                <Label htmlFor="salaried_employee" className="text-base">
                  Are you a salaried employee?
                </Label>
              </div>
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
