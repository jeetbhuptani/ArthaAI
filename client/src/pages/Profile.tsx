"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  User,
  Pencil,
  Trash2,
  FileText,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { ProfileForm } from "@/components/ProfileForm";
import FinancialFormWizard from "./FinancialFormWizard";
interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  profilePicture?: string;
}
import { toast } from "sonner";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showFinancialWizard, setShowFinancialWizard] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Use environment variables properly for React
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await response.json();
      console.log("User data:", userData); // Debugging line
      setUser(userData);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message);

      // For demo purposes, set mock data if API fails
      setUser({
        id: "user123",
        firstname: "Artha",
        lastname: "User",
        email: "user@arthaai.com",
        profilePicture: "/placeholder.svg?height=200&width=200",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData: Partial<UserProfile>) => {
    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
      setIsEditing(false);
      toast.success("Profile updated", {
        description: "Your profile has been successfully updated.",
      })
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error("Update failed",
        { description:
          err.message || "Failed to update profile. Please try again.",
      });

      // For demo purposes, update the local state anyway
      if (user) {
        setUser({ ...user, ...updatedData });
        setIsEditing(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(`${API_BASE_URL}/api/auth/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      localStorage.removeItem("auth_token");
      toast.success("Account deleted", {
        description: "Your account has been successfully deleted.",
      });
      window.location.href = "/authentication"; 
    } catch (err: any) {
      console.error("Error deleting account:", err);
      toast.error("Deletion failed",{
        description:
          err.message || "Failed to delete account. Please try again.",
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const toggleFinancialWizard = () => {
    setShowFinancialWizard((prev) => !prev);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-teal-600 dark:text-teal-400" />
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <Card className="border-red-100 dark:border-red-900/50 shadow-md max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="border-teal-100 dark:border-teal-900/50 shadow-md max-w-3xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
          <CardTitle className="text-2xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
            <User className="h-6 w-6" />
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800 dark:data-[state=active]:bg-teal-900/50 dark:data-[state=active]:text-teal-300"
              >
                Profile Information
              </TabsTrigger>
              <TabsTrigger
                value="financial"
                className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800 dark:data-[state=active]:bg-teal-900/50 dark:data-[state=active]:text-teal-300"
              >
                Financial Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              {user && !isEditing ? (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-shrink-0">
                      <Avatar className="h-32 w-32 border-4 border-teal-100 dark:border-teal-900/50">
                        <AvatarImage
                          src={user.profilePicture || "/placeholder.svg"}
                          alt={`${user.firstname} ${user.lastname}`}
                        />
                        <AvatarFallback className="text-3xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400">
                          {user.firstname.charAt(0)}
                          {user.lastname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-300">
                          {user.firstname} {user.lastname}
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400">
                          {user.email}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 dark:border-teal-800 dark:text-teal-300 dark:hover:bg-teal-900/20"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>

                        <Button
                          onClick={() => setShowDeleteDialog(true)}
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-0 gap-4 mt-8">
                    <div className="p-4 rounded-md bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50">
                      <h3 className="font-medium text-teal-700 dark:text-teal-300 mb-2">
                        Account Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">
                            First Name:
                          </span>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {user.firstname}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">
                            Last Name:
                          </span>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {user.lastname}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">
                            Email:
                          </span>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {user.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">
                            Password:
                          </span>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            ••••••••
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* <div className="p-4 rounded-md bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50">
                      <h3 className="font-medium text-teal-700 dark:text-teal-300 mb-2">
                        Account Security
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">
                            Last Login:
                          </span>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            Today, 10:30 AM
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">Two-Factor Auth:</span>
                          <span className="font-medium text-amber-600 dark:text-amber-400">Not Enabled</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">
                            Account Status:
                          </span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            Active
                          </span>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              ) : (
                <ProfileForm
                  user={user}
                  onSubmit={handleProfileUpdate}
                  onCancel={() => setIsEditing(false)}
                />
              )}
            </TabsContent>

            <TabsContent value="financial" className="mt-6">
              <div className="space-y-6">
                <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-md border border-teal-100 dark:border-teal-900/50 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-lg font-medium text-teal-700 dark:text-teal-300 mb-2">
                    Financial Profile
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    Complete your financial profile to get personalized
                    investment recommendations and insights.
                  </p>
                  <Button
                    onClick={() => toggleFinancialWizard()}
                    className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
                  >
                    {showFinancialWizard
                      ? "Hide Financial Wizard"
                      : "Open Financial Wizard"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {showFinancialWizard && (
                  <div className="mt-6">
                    <FinancialFormWizard />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <ShieldAlert className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-md text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
            <p>Warning: Deleting your account will:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Remove all your personal information</li>
              <li>Delete your financial profile and analysis</li>
              <li>Cancel any active subscriptions</li>
              <li>Remove access to all ArthaAI services</li>
            </ul>
          </div>
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
