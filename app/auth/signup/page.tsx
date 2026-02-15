"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, UserPlus, Sparkles, Check, Building2, Users } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState<"role" | "details">("role");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "" as "creator" | "brand" | "",
    });

    const handleRoleSelect = (role: "creator" | "brand") => {
        setFormData({ ...formData, role });
        setStep("details");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!formData.role) {
            setError("Please select a role");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!data.success) {
                setError(data.error?.message || "Signup failed");
                setLoading(false);
                return;
            }

            // Redirect to profile creation
            if (formData.role === "creator") {
                router.push("/creators/onboarding");
            } else {
                router.push("/brands/onboarding");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4 pt-24">
            <div className="w-full max-w-6xl">
                {step === "role" ? (
                    // Role Selection Step
                    <div className="text-center mb-12">
                        <Badge className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 mb-6 text-base px-6 py-2">
                            <Sparkles className="h-4 w-4 mr-2 inline" />
                            Join GopGop
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                            I want to join as a...
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                            Choose your account type to get started with the perfect experience
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
                            {/* Creator Card */}
                            <Card
                                onClick={() => handleRoleSelect("creator")}
                                className="p-8 md:p-10 border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group hover:border-violet-500"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    <Users className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-black mb-3">Creator</h2>
                                <p className="text-muted-foreground font-medium mb-6">
                                    Monetize your content and connect with brands
                                </p>
                                <ul className="space-y-3 text-left">
                                    {[
                                        "Get verified and discovered",
                                        "Showcase your best reels",
                                        "Connect with premium brands",
                                        "Transparent analytics"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm font-medium">
                                            <Check className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full mt-8 h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 font-black">
                                    Continue as Creator
                                </Button>
                            </Card>

                            {/* Brand Card */}
                            <Card
                                onClick={() => handleRoleSelect("brand")}
                                className="p-8 md:p-10 border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group hover:border-blue-500"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    <Building2 className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-black mb-3">Brand</h2>
                                <p className="text-muted-foreground font-medium mb-6">
                                    Find authentic creators for your campaigns
                                </p>
                                <ul className="space-y-3 text-left">
                                    {[
                                        "Advanced creator discovery",
                                        "Data-driven insights",
                                        "Direct communication",
                                        "7-day free trial"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm font-medium">
                                            <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full mt-8 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black">
                                    Continue as Brand
                                </Button>
                            </Card>
                        </div>

                        <p className="text-muted-foreground font-medium mt-8">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="font-black text-violet-600 hover:text-violet-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                ) : (
                    // Details Form Step
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        {/* Left Side - Selected Role Info */}
                        <div className="hidden lg:block space-y-8">
                            <div>
                                <Badge className={`${formData.role === "creator" ? "bg-violet-600 hover:bg-violet-700" : "bg-blue-600 hover:bg-blue-700"} mb-4 text-sm px-4 py-1.5`}>
                                    {formData.role === "creator" ? "Creator Account" : "Brand Account"}
                                </Badge>
                                <h1 className="text-5xl font-black tracking-tight mb-4">
                                    Almost <span className={formData.role === "creator" ? "text-violet-600" : "text-blue-600"}>There!</span>
                                </h1>
                                <p className="text-xl text-muted-foreground font-medium">
                                    {formData.role === "creator"
                                        ? "Create your creator account and start showcasing your work"
                                        : "Set up your brand account and discover authentic creators"}
                                </p>
                            </div>

                            <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-2 border-violet-200 dark:border-slate-700">
                                <h3 className="font-black text-lg mb-4">What's Next?</h3>
                                <div className="space-y-3">
                                    {(formData.role === "creator" ? [
                                        "📝 Complete your profile",
                                        "📸 Add your best reels",
                                        "✅ Request verification",
                                        "🚀 Get discovered by brands"
                                    ] : [
                                        "🏢 Add company details",
                                        "🔍 Start searching creators",
                                        "💬 Send collaboration inquiries",
                                        "📊 Access analytics dashboard"
                                    ]).map((step, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-black text-sm">
                                                {i + 1}
                                            </div>
                                            <span className="font-medium">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Signup Form */}
                        <Card className="p-8 md:p-12 border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl">
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserPlus className={`h-6 w-6 ${formData.role === "creator" ? "text-violet-600" : "text-blue-600"}`} />
                                    <h2 className="text-3xl font-black">Create Account</h2>
                                </div>
                                <p className="text-muted-foreground">Fill in your details to get started</p>

                                <Button
                                    variant="ghost"
                                    onClick={() => setStep("role")}
                                    className="mt-4 text-sm font-bold"
                                >
                                    ← Change role
                                </Button>
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
                                            placeholder="At least 8 characters"
                                            className="h-14 rounded-2xl border-2 font-medium text-base pr-12"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-1">Must be at least 8 characters</p>
                                </div>

                                <div className="flex items-start gap-2">
                                    <input type="checkbox" className="w-4 h-4 rounded border-2 mt-1" required />
                                    <span className="text-sm text-muted-foreground">
                                        I agree to the{" "}
                                        <Link href="/terms" className="font-bold text-foreground hover:text-violet-600">
                                            Terms of Service
                                        </Link>
                                        {" "}and{" "}
                                        <Link href="/privacy" className="font-bold text-foreground hover:text-violet-600">
                                            Privacy Policy
                                        </Link>
                                    </span>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full h-14 rounded-2xl ${formData.role === "creator"
                                        ? "bg-violet-600 hover:bg-violet-700 shadow-violet-500/20"
                                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                                        } text-white font-black text-lg shadow-xl`}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating account...
                                        </span>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>

                                <div className="text-center">
                                    <p className="text-muted-foreground font-medium">
                                        Already have an account?{" "}
                                        <Link href="/auth/login" className="font-black text-violet-600 hover:text-violet-700">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </div>
        </main>
    );
}
