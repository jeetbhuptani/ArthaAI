import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, User } from 'lucide-react'

// Define the form schema for validation
const formSchema = z.object({
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select your gender",
  }),
  age: z.number().min(10).max(100),
})

// Define the type for the form data
export type UserProfileData = z.infer<typeof formSchema>

// Define the props interface for the component
interface UserProfileFormProps {
  data: Partial<UserProfileData>;
  update: (data: UserProfileData) => void;
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
      age: data.age || 25,
    },
  })

  // Pre-fill form with existing data
  useEffect(() => {
    if (data.gender) {
      setValue("gender", data.gender as "Male" | "Female" | "Other");
    }
    if (data.age) {
      setValue("age", data.age);
    }
  }, [data, setValue]);

  const onSubmit = (formData: UserProfileData) => {
    update(formData);
  }

  return (
    <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
        <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
          <User className="h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Gender */}
          <div className="space-y-3">
            <Label className="text-base">Gender</Label>
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
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
            )}
          </div>

          {/* Age */}
          <div className="space-y-3">
            <Label htmlFor="age" className="text-base">Age</Label>
            <Input
              id="age"
              type="number"
              min={10}
              max={100}
              {...register("age", { valueAsNumber: true })}
              className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400"
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
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
  )
}
