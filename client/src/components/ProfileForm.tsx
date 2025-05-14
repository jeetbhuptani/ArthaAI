"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save, X, Upload, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
// Define the form schema for validation
const profileSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    currentPassword: z.string().transform(val => val === "" ? undefined : val).optional(),
    newPassword: z
      .string()
      .transform(val => val === "" ? undefined : val)
      .pipe(z.string().min(8, "New password must be at least 8 characters").optional())
      .optional(),
    confirmPassword: z.string().transform(val => val === "" ? undefined : val).optional(),
  })
  .refine(
    (data) => {
      // Only validate if newPassword is provided
      if (!data.newPassword) return true;

      // If newPassword is provided, currentPassword must also be provided
      if (!data.currentPassword) return false;

      return true;
    },
    {
      message: "Current password is required when setting a new password",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      // Only validate if newPassword is provided
      if (!data.newPassword) return true;

      // Confirm password must match new password
      return data.newPassword === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type ProfileFormValues = z.infer<typeof profileSchema>;

interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  currentPassword?: string;
  password?: string;
  profilePicture?: string;
}

interface ProfileFormProps {
  user: UserProfile | null;
  onSubmit: (data: Partial<UserProfile>) => void;
  onCancel: () => void;
}

export function ProfileForm({ user, onSubmit, onCancel }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profilePicture || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstname || "",
      lastName: user?.lastname || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Please select an image smaller than 5MB",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  };
  const handleFormSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);

    try {
      // Handle image upload if there's a new image
      let profilePictureUrl = user?.profilePicture;

      if (imageFile) {
        setUploadingImage(true);
        try {
          // Upload to Cloudinary
          profilePictureUrl = await uploadToCloudinary(imageFile);
          toast.success("Image uploaded successfully");
        } catch (error: any) {
          toast.error("Failed to upload image", {
            description: error.message || "Please try again later",
          });
          console.error("Error uploading image:", error);
          // Continue with form submission even if image upload fails
          // Use the previous profile picture
        } finally {
          setUploadingImage(false);
        }
      }

      // Prepare the data to submit
      const submitData: Partial<UserProfile> = {
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        profilePicture: profilePictureUrl,
      };

      if (data.newPassword && data.currentPassword) {
        submitData.currentPassword = data.currentPassword;
        submitData.password = data.newPassword;
      }

      // Call the parent component's onSubmit function
      onSubmit(submitData);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-shrink-0">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-teal-100 dark:border-teal-900/50">
              <AvatarImage src={profileImage || undefined} alt="Profile" />
              <AvatarFallback className="text-3xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400">
                {user?.firstname?.charAt(0) || ""}
                {user?.lastname?.charAt(0) || ""}
              </AvatarFallback>
            </Avatar>

            <div className="absolute -bottom-2 -right-2">
              <Label htmlFor="profile-picture" className="cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-teal-600 dark:bg-teal-700 text-white flex items-center justify-center hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                  <Upload className="h-4 w-4" />
                </div>
              </Label>
              <Input
                id="profile-picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-sm text-zinc-700 dark:text-zinc-300"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className={`border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 ${
                  errors.firstName ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-sm text-zinc-700 dark:text-zinc-300"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className={`border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 ${
                  errors.lastName ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm text-zinc-700 dark:text-zinc-300"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={`border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 ${
                errors.email ? "border-red-500 dark:border-red-500" : ""
              }`}
              disabled
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <h3 className="text-lg font-medium text-teal-700 dark:text-teal-300 mb-4">
          Change Password
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="currentPassword"
              className="text-sm text-zinc-700 dark:text-zinc-300"
            >
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                {...register("currentPassword")}
                placeholder="Leave blank to keep current"
                className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm text-zinc-700 dark:text-zinc-300"
            >
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("newPassword")}
                placeholder="Leave blank to keep current"
                className="border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm text-zinc-700 dark:text-zinc-300"
            >
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="Leave blank to keep current"
              className={`border-zinc-300 dark:border-zinc-700 focus:ring-teal-500 dark:focus:ring-teal-400 ${
                errors.confirmPassword
                  ? "border-red-500 dark:border-red-500"
                  : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-zinc-300 dark:border-zinc-700"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
        >
          {isSubmitting || uploadingImage ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {uploadingImage ? "Uploading..." : "Saving..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
