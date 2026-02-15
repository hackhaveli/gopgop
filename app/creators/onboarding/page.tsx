"use client";

import { useState, useEffect } from "react";
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
    User,
    BarChart3,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Loader2,
    CheckCircle2,
    Instagram,
    MapPin,
    Mail,
    Phone
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const steps = [
    { id: 1, name: "Profile", icon: User },
    { id: 2, name: "Stats", icon: BarChart3 },
    { id: 3, name: "Review", icon: Sparkles },
];

export default function CreatorOnboarding() {
    const router = useRouter();
    const supabase = createClient();
    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        city: "",
        niche: "",
        instagram: "",
        email: "",
        whatsapp: "",
        followersRange: "",
        avgLikes: "",
        bio: "",
    });

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error || !user) {
                    toast.error("Please login first to access onboarding");
                    router.push("/auth/login");
                    return;
                }

                // Check if user is a creator
                const { data: userData } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single() as { data: { role: string } | null };

                if (userData && userData.role !== 'creator') {
                    toast.error("This page is only for creators");
                    router.push("/");
                    return;
                }

                setLoading(false);
            } catch (err) {
                console.error("Auth check error:", err);
                toast.error("Authentication error. Please login again.");
                router.push("/auth/login");
            }
        };

        checkAuth();
    }, [router, supabase]);

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                toast.error("Session expired. Please login again.");
                router.push("/auth/login");
                return;
            }

            // Update profile
            // @ts-ignore - Database types may be out of sync with actual schema
            const { error: profileError } = await supabase
                .from('creator_profiles')
                .update({
                    display_name: formData.name,
                    city: formData.city,
                    niche: formData.niche,
                    username: formData.instagram.replace('@', ''),
                    whatsapp: formData.whatsapp,
                    contact_email: formData.email,
                    instagram_followers: parseInt(formData.followersRange.replace(/[^0-9]/g, '')) || 0,
                    bio: formData.bio,
                    verification_status: 'pending',
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id);

            if (profileError) {
                console.error("Profile update error:", profileError);
                toast.error("Failed to update profile: " + profileError.message);
                setSubmitting(false);
                return;
            }

            toast.success("Profile created successfully!");
            router.push("/creators/dashboard");
        } catch (err: any) {
            console.error("Onboarding error:", err);
            toast.error(err.message || "An error occurred during onboarding");
            setSubmitting(false);
        }
    };

    // Show loading screen while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-violet-600 mx-auto mb-4" />
                    <p className="text-lg font-bold text-slate-600 dark:text-slate-400">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
            {/* Optimized Background matching Hero Section */}
            <div className="absolute inset-0 -z-10">
                {/* Static gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/40 to-pink-50/40 dark:from-slate-950 dark:via-violet-950/20 dark:to-pink-950/20" />

                {/* Animated gradient orbs */}
                <motion.div
                    animate={{
                        x: [0, 30, -20, 0],
                        y: [0, -50, 20, 0],
                        scale: [1, 1.1, 0.9, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-violet-400/10 dark:bg-violet-500/10 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -40, 30, 0],
                        y: [0, 40, -40, 0],
                        scale: [1, 1.2, 0.8, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-pink-400/10 dark:bg-pink-500/10 rounded-full blur-[120px]"
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
                            <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                                Creator Setup
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black tracking-tighter mb-4"
                        >
                            <span className="italic block text-slate-400 text-2xl md:text-3xl mb-1">Create Your</span>
                            <span className="bg-gradient-to-r from-violet-600 via-pink-600 to-violet-500 bg-clip-text text-transparent">Professional Media Kit</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl mx-auto"
                        >
                            Get your verified creator page in minutes and start landing brand deals.
                        </motion.p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-12 max-w-2xl mx-auto">
                        <div className="flex justify-between items-center relative gap-2 sm:gap-4">
                            {/* Background Line */}
                            <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>

                            {steps.map((step, index) => (
                                <div key={step.id} className="flex flex-col items-center relative z-10">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: currentStep === step.id ? 1.1 : 1,
                                            backgroundColor: currentStep >= step.id ? "rgb(124, 58, 237)" : "rgb(255, 255, 255)",
                                        }}
                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-[1rem] sm:rounded-[1.25rem] flex items-center justify-center border-2 transition-all shadow-xl ${currentStep >= step.id
                                            ? "border-violet-600 text-white shadow-violet-500/20"
                                            : "dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                                            }`}
                                    >
                                        <step.icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={3} />
                                    </motion.div>
                                    <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest mt-3 transition-colors duration-500 ${currentStep >= step.id ? "text-violet-600" : "text-slate-400"
                                        }`}>
                                        {step.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <Card className="p-8 md:p-12 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950/50 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

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
                                            <div className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded-2xl text-violet-600">
                                                <User className="h-6 w-6" />
                                            </div>
                                            <h2 className="text-3xl font-black tracking-tight">Basic Details</h2>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-wider ml-1">Full Name *</Label>
                                                <Input
                                                    placeholder="Your name"
                                                    className="h-14 rounded-2xl border-2 font-bold px-6 text-lg"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-wider ml-1">City *</Label>
                                                <Input
                                                    placeholder="e.g. Mumbai"
                                                    className="h-14 rounded-2xl border-2 font-bold px-6 text-lg"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-wider ml-1">Niche *</Label>
                                            <Select value={formData.niche} onValueChange={(value) => setFormData({ ...formData, niche: value })}>
                                                <SelectTrigger className="h-14 rounded-2xl border-2 font-bold px-6 text-lg text-left">
                                                    <SelectValue placeholder="Select your niche" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-2 font-bold">
                                                    <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                                                    <SelectItem value="food">Food & Cooking</SelectItem>
                                                    <SelectItem value="tech">Tech & Gadgets</SelectItem>
                                                    <SelectItem value="travel">Travel</SelectItem>
                                                    <SelectItem value="fitness">Fitness & Health</SelectItem>
                                                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                                                    <SelectItem value="education">Education</SelectItem>
                                                    <SelectItem value="comedy">Comedy & Entertainment</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-wider ml-1">Instagram Username *</Label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">@</span>
                                                <Input
                                                    placeholder="yourusername"
                                                    className="h-14 rounded-2xl border-2 font-bold pl-12 pr-6 text-lg"
                                                    value={formData.instagram}
                                                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-wider ml-1">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                <Input
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    className="h-14 rounded-2xl border-2 font-bold pl-14 pr-6 text-lg"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-wider ml-1">WhatsApp Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                <Input
                                                    type="tel"
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className="h-14 rounded-2xl border-2 font-bold pl-14 pr-6 text-lg"
                                                    value={formData.whatsapp}
                                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
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
                                            <div className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded-2xl text-violet-600">
                                                <BarChart3 className="h-6 w-6" />
                                            </div>
                                            <h2 className="text-3xl font-black tracking-tight">Your Stats</h2>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-wider ml-1">Followers Range *</Label>
                                                <Select value={formData.followersRange} onValueChange={(value) => setFormData({ ...formData, followersRange: value })}>
                                                    <SelectTrigger className="h-14 rounded-2xl border-2 font-bold px-6 text-lg text-left">
                                                        <SelectValue placeholder="Select range" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-2 font-bold">
                                                        <SelectItem value="1000">1K - 5K</SelectItem>
                                                        <SelectItem value="5000">5K - 10K</SelectItem>
                                                        <SelectItem value="10000">10K - 25K</SelectItem>
                                                        <SelectItem value="25000">25K - 50K</SelectItem>
                                                        <SelectItem value="50000">50K - 100K</SelectItem>
                                                        <SelectItem value="100000">100K+</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-wider ml-1">Avg. Likes per post *</Label>
                                                <Input
                                                    placeholder="e.g. 1500"
                                                    className="h-14 rounded-2xl border-2 font-bold px-6 text-lg"
                                                    value={formData.avgLikes}
                                                    onChange={(e) => setFormData({ ...formData, avgLikes: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-wider ml-1">Bio / About You *</Label>
                                        <Textarea
                                            placeholder="Tell brands why they should work with you..."
                                            className="min-h-[140px] rounded-[2rem] border-2 font-bold p-6 text-lg focus:ring-violet-500"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8 text-center py-4"
                                >
                                    <div className="max-w-md mx-auto space-y-6">
                                        <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-pink-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-violet-500/30">
                                            <CheckCircle2 className="h-12 w-12" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black tracking-tight mb-3">Ready to Go!</h2>
                                            <p className="text-lg text-muted-foreground font-medium">
                                                Your professional media kit is ready to be published. You can add your reels and insights proofs from the dashboard.
                                            </p>
                                        </div>

                                        <div className="p-6 bg-violet-50/50 dark:bg-violet-950/20 rounded-[2rem] border-2 border-violet-100 dark:border-violet-900/30">
                                            <p className="text-sm font-bold text-violet-600 dark:text-violet-400">
                                                🎉 You're joining a community of 5,000+ verified Indian creators.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-12 pt-8 border-t-2 border-slate-100 dark:border-slate-800">
                            {currentStep > 1 ? (
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    className="h-14 px-8 rounded-2xl font-black gap-2 hover:bg-slate-100"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                    Back
                                </Button>
                            ) : (
                                <div />
                            )}

                            <Button
                                onClick={handleNext}
                                disabled={submitting}
                                className={`h-14 px-10 rounded-2xl font-black gap-2 shadow-xl transition-all hover:scale-[1.02] active:scale-95 ${currentStep === steps.length
                                    ? "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25"
                                    : "bg-slate-950 dark:bg-white text-white dark:text-slate-900 shadow-slate-900/20"
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Publishing...
                                    </>
                                ) : currentStep === steps.length ? (
                                    "Publish Media Kit"
                                ) : (
                                    <>
                                        Next Step
                                        <ChevronRight className="h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>

                    <div className="text-center mt-8">
                        <Link href="/" className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-violet-600 transition-colors">
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
