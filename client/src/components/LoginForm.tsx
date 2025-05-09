import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: "jeet@gmail.com",
        password: "Jeet@563",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            // Redirect to the page they were trying to access or dashboard
            const from = location.state?.from?.pathname || "/dashboard";
            navigate(from);
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setLoading(true);

        try {
            const response = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed. Please check your credentials.");
                setLoading(false);
                return;
            }

            // Save token and authenticate user
            await login(data.token);
            // Navigation happens in useEffect
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    

    return (
        <div className="px-8 pt-6">
            <div className="text-center mb-6">
                <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
                    Welcome Back to ArthaAI
                </h2>
                <p className="text-neutral-600 text-sm max-w-sm mx-auto dark:text-neutral-300 mt-2">
                    Log in to continue your financial journey - Credentials prepopulated for demo purposes.
                </p>
            </div>

            {error && (
                <div className="mb-4 p-2 text-red-500 text-center bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded">
                    {error}
                </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
                <LabelInputContainer>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        placeholder="you@example.com"
                        type="email"
                        value={formData.email} 
                        onChange={handleChange}
                        className="h-10 text-black dark:text-white"
                        required
                    />
                </LabelInputContainer>

                <LabelInputContainer>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="h-10 text-black dark:text-white"
                        required
                    />
                    <div className="text-right text-sm">
                        <a href="/forgot-password" className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
                            Forgot password?
                        </a>
                    </div>
                </LabelInputContainer>

                <button
                    className="relative w-full h-10 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium shadow-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 group/btn"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Log In"}
                    <BottomGradient />
                </button>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
