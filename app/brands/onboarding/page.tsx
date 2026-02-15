"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    Target,
    Users,
    Sparkles,
    CheckCircle2,
    Globe,
    Briefcase
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const steps = [
    { id: 1, name: "Company", icon: Building2 },
    { id: 2, name: "Campaign", icon: Target },
    { id: 3, name: "Preferences", icon: Users },
    { id: 4, name: "Review", icon: Sparkles },
];

export default function BrandOnboarding() {
    const router = useRouter();
    const supabase = createClient();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: "",
        industry: "",
        website: "",
        instagram: "",
        budgetRange: "",
        campaignGoal: "",
        targetNiche: "",
        description: "",
    });

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/brands/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_name: formData.companyName,
                    industry: formData.industry,
                    website_url: formData.website,
                    instagram_handle: formData.instagram,
                    description: formData.description,
                }),
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || "Failed to update profile");
            }

            router.push("/brands/dashboard");
        } catch (err: any) {
            console.error("Onboarding error:", err);
            toast.error(err.message || "An error occurred during onboarding");
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
            {/* Optimized Background matching Hero Section */}
            <div className="absolute inset-0 -z-10">
                {/* Static gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20" />

                {/* Animated gradient orbs */}
                <motion.div
                    animate={{
                        x: [0, 30, -20, 0],
                        y: [0, -50, 20, 0],
                        scale: [1, 1.1, 0.9, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -40, 30, 0],
                        y: [0, 40, -40, 0],
                        scale: [1, 1.2, 0.8, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-[120px]"
                />

                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm"
                        >
                            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Brand Onboarding
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black tracking-tighter mb-4"
                        >
                            <span className="italic block text-slate-400 text-2xl md:text-3xl mb-1">Welcome to</span>
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">GopGop Brand</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl mx-auto"
                        >
                            Let&apos;s personalize your experience to help you find the perfect creators.
                        </motion.p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-12 max-w-2xl mx-auto">
                        <div className="flex justify-between items-center relative gap-4">
                            {/* Background Line */}
                            <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>

                            {steps.map((step, index) => (
                                <div key={step.id} className="flex flex-col items-center relative z-10">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: currentStep === step.id ? 1.1 : 1,
                                            backgroundColor: currentStep >= step.id ? "rgb(37, 99, 235)" : "rgb(255, 255, 255)",
                                        }}
                                        className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center border-2 transition-all shadow-xl ${currentStep >= step.id
                                            ? "border-blue-600 text-white shadow-blue-500/20"
                                            : "dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                                            }`}
                                    >
                                        <step.icon className="h-5 w-5" strokeWidth={3} />
                                    </motion.div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest mt-3 transition-colors duration-500 ${currentStep >= step.id ? "text-blue-600" : "text-slate-400"
                                        }`}>
                                        {step.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Card */}
                    <Card className="p-8 md:p-12 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950/50 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl text-blue-600">
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            <h2 className="text-3xl font-black tracking-tight">Tell us about your company</h2>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-wider ml-1">Company Name *</Label>
                                                <Input
                                                    placeholder="e.g. Acme Wear"
                                                    className="h-14 rounded-2xl border-2 font-bold px-6 text-lg"
                                                    value={formData.companyName}
                                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-wider ml-1">Industry *</Label>
                                                <Select value={formData.industry} onValueChange={(v) => setFormData({ ...formData, industry: v })}>
                                                    <SelectTrigger className="h-14 rounded-2xl border-2 font-bold px-6 text-lg">
                                                        <SelectValue placeholder="Select industry" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-2 font-bold">
                                                        <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                                                        <SelectItem value="food">Food & Beverage</SelectItem>
                                                        <SelectItem value="tech">Tech & Software</SelectItem>
                                                        <SelectItem value="fitness">Health & Fitness</SelectItem>
                                                        <SelectItem value="beauty">Beauty & Cosmetics</SelectItem>
                                                        <SelectItem value="lifestyle">Lifestyle & Decor</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-wider ml-1">Website URL</Label>
                                            <div className="relative">
                                                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                <Input
                                                    placeholder="acmewear.com"
                                                    className="h-14 rounded-2xl border-2 font-bold pl-14 pr-6 text-lg"
                                                    value={formData.website}
                                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-wider ml-1">Instagram Handle</Label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">@</span>
                                                <Input
                                                    placeholder="acmewear_official"
                                                    className="h-14 rounded-2xl border-2 font-bold pl-12 pr-6 text-lg"
                                                    value={formData.instagram}
                                                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-600">
                                                <Target className="h-6 w-6" />
                                            </div>
                                            <h2 className="text-3xl font-black tracking-tight">Campaign Goals</h2>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-wider ml-1">Primary Objective *</Label>
                                                <Select value={formData.campaignGoal} onValueChange={(v) => setFormData({ ...formData, campaignGoal: v })}>
                                                    <SelectTrigger className="h-14 rounded-2xl border-2 font-bold px-6 text-lg">
                                                        <SelectValue placeholder="What is your main goal?" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-2 font-bold">
                                                        <SelectItem value="awareness">Brand Awareness</SelectItem>
                                                        <SelectItem value="sales">Driving Sales / Conversions</SelectItem>
                                                        <SelectItem value="content">UGC Content Creation</SelectItem>
                                                        <SelectItem value="traffic">Traffic to Website</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-wider ml-1">Monthly Influencer Budget Range *</Label>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    {["₹10K-₹50K", "₹50K-₹2L", "₹2L-₹5L", "₹5L+"].map((range) => (
                                                        <button
                                                            key={range}
                                                            onClick={() => setFormData({ ...formData, budgetRange: range })}
                                                            className={`h-14 rounded-2xl border-2 font-black transition-all ${formData.budgetRange === range
                                                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                                : "border-slate-100 dark:border-slate-800 hover:border-blue-500"
                                                                }`}
                                                        >
                                                            {range}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-emerald-600">
                                                <Users className="h-6 w-6" />
                                            </div>
                                            <h2 className="text-3xl font-black tracking-tight">Creator Preferences</h2>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-wider ml-1">Ideal Creator Niche *</Label>
                                                <Select value={formData.targetNiche} onValueChange={(v) => setFormData({ ...formData, targetNiche: v })}>
                                                    <SelectTrigger className="h-14 rounded-2xl border-2 font-bold px-6 text-lg">
                                                        <SelectValue placeholder="Who are you looking for?" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-2 font-bold">
                                                        <SelectItem value="any">Any (Mixed Audience)</SelectItem>
                                                        <SelectItem value="fashion">Fashionistas</SelectItem>
                                                        <SelectItem value="food">Foodies & Chefs</SelectItem>
                                                        <SelectItem value="tech">Tech Reviewers</SelectItem>
                                                        <SelectItem value="fitness">Fitness Enthusiasts</SelectItem>
                                                        <SelectItem value="travel">Travel Bloggers</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-wider ml-1">Brief Description of your brand</Label>
                                                <Textarea
                                                    placeholder="Tell us a bit about your brand voice and what makes you unique..."
                                                    className="min-h-[140px] rounded-3xl border-2 font-bold p-6 text-lg"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="text-center space-y-8 py-4"
                                >
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/20 animate-bounce">
                                        <CheckCircle2 className="h-12 w-12" strokeWidth={3} />
                                    </div>

                                    <div>
                                        <h2 className="text-4xl font-black tracking-tight mb-4">You&apos;re all set!</h2>
                                        <p className="text-xl text-muted-foreground font-medium max-w-md mx-auto">
                                            We&apos;ve customized your dashboard. You can now start discovering verified creators.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-left">
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Company</p>
                                            <p className="font-black truncate">{formData.companyName || "Acme Inc"}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Niche</p>
                                            <p className="font-black truncate capitalize">{formData.industry || "Fashion"}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t-2 border-slate-100 dark:border-slate-800">
                            <Button
                                variant="ghost"
                                onClick={handlePrev}
                                disabled={currentStep === 1 || loading}
                                className="h-14 px-8 rounded-2xl font-black group gap-2"
                            >
                                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                                Previous
                            </Button>

                            {currentStep < steps.length ? (
                                <Button
                                    onClick={handleNext}
                                    className="h-16 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl group gap-2 shadow-xl shadow-blue-500/20 min-w-[180px]"
                                >
                                    Continue
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="h-16 px-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl group gap-2 shadow-2xl min-w-[240px] hover:scale-105 transition-all"
                                >
                                    {loading ? (
                                        <Sparkles className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            Explore Creators
                                            <Briefcase className="h-5 w-5" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </Card>

                    <div className="text-center mt-12">
                        <Link href="/" className="text-sm font-black text-muted-foreground uppercase tracking-widest hover:text-blue-600 transition-colors">
                            ← Exit Setup
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
