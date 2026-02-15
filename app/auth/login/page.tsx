"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, LogIn, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!data.success) {
                setError(data.error?.message || "Login failed");
                setLoading(false);
                return;
            }

            // Redirect based on role
            const role = data.data.user.role;
            if (role === "admin") {
                router.push("/admin");
            } else if (role === "creator") {
                router.push("/creators/dashboard");
            } else if (role === "brand") {
                router.push("/brands/dashboard");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950 flex items-center justify-center p-4 pt-24">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <div className="hidden lg:block space-y-8">
                    <div>
                        <Badge className="bg-violet-600 hover:bg-violet-700 mb-4 text-sm px-4 py-1.5">
                            Welcome Back
                        </Badge>
                        <h1 className="text-5xl font-black tracking-tight mb-4">
                            Login to <span className="text-violet-600">GopGop</span>
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium">
                            Access your account and continue building authentic brand partnerships.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { icon: "🎯", title: "Quick Access", desc: "Jump right back into your dashboard" },
                            { icon: "🔒", title: "Secure Login", desc: "Your data is protected with enterprise-grade security" },
                            { icon: "🚀", title: "Pick Up Where You Left", desc: "All your conversations and shortlists saved" },
                        ].map((feature, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800">
                                <div className="text-3xl">{feature.icon}</div>
                                <div>
                                    <h3 className="font-black text-lg mb-1">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <Card className="p-8 md:p-12 border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <LogIn className="h-6 w-6 text-violet-600" />
                            <h2 className="text-3xl font-black">Sign In</h2>
                        </div>
                        <p className="text-muted-foreground">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-900">
                                <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-wider ml-1">Email Address</Label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                className="h-14 rounded-2xl border-2 font-medium text-base"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-wider ml-1">Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-14 rounded-2xl border-2 font-medium text-base pr-12"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-2" />
                                <span className="text-sm font-medium">Remember me</span>
                            </label>
                            <Link href="/auth/forgot-password" className="text-sm font-bold text-violet-600 hover:text-violet-700">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-lg shadow-xl shadow-violet-500/20 group"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-slate-200 dark:border-slate-800" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-slate-900 font-bold text-muted-foreground">OR</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-muted-foreground font-medium">
                                Don't have an account?{" "}
                                <Link href="/auth/signup" className="font-black text-violet-600 hover:text-violet-700">
                                    Sign up for free
                                </Link>
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </main>
    );
}
