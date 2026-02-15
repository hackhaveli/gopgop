import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Check, TrendingUp, Zap, Star, ArrowRight, Video,
    Share2, DollarSign, Shield, Sparkles, Award, Play,
    Instagram, Smartphone, Globe, BarChart3, Rocket
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
    title: "GopGop | Professional Media Kits for Indian Creators",
    description: "Stop sending PDFs. Start sending GopGop. The most stunning, proof-based media kit for the next generation of Indian influencers.",
};

export default function CreatorsPage() {
    return (
        <main className="min-h-screen pt-20 bg-white dark:bg-[#020617] overflow-hidden">
            {/* Hero Section - The "WOW" Factor */}
            <section className="relative py-24 md:py-32 xl:py-48 bg-white dark:bg-[#020617]">
                {/* Animated Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-violet-100/50 via-transparent to-transparent dark:from-violet-950/20 pointer-events-none"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[160px] animate-pulse delay-700"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                        {/* Left Content */}
                        <div className="text-left animate-in fade-in slide-in-from-left duration-1000">
                            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-800 shadow-sm mb-8">
                                <div className="w-2 h-2 rounded-full bg-violet-600 animate-ping"></div>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-600">Join India's Top 1% Creators</span>
                            </div>

                            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-slate-900 dark:text-white">
                                Stop Sending <span className="text-violet-600 italic">PDFs.</span>
                                <span className="block mt-4">Send <span className="bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">GopGop.</span></span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium mb-12 max-w-xl leading-relaxed">
                                The most stunning, <span className="text-slate-900 dark:text-white font-black underline decoration-violet-500 decoration-4">proof-based</span> media kit builder for creators who mean business. Launch yours in <span className="bg-violet-100 dark:bg-violet-950 px-2 py-0.5 rounded-lg text-violet-600 font-black italic">180 seconds.</span>
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-12">
                                <Link href="/creators/get-started">
                                    <Button size="lg" className="h-16 sm:h-20 px-6 sm:px-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                                        Create Kit Free
                                        <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6" strokeWidth={3} />
                                    </Button>
                                </Link>
                                <Link href="#preview">
                                    <Button size="lg" variant="outline" className="h-16 sm:h-20 px-6 sm:px-10 border-2 border-slate-200 dark:border-slate-800 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group w-full sm:w-auto">
                                        <Play className="mr-3 h-4 w-4 sm:h-5 sm:w-5 fill-slate-900 dark:fill-white group-hover:scale-110 transition-transform" />
                                        How it Works
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust & Stats */}
                            <div className="flex flex-wrap items-center gap-10">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 border-4 border-white dark:border-[#020617] flex items-center justify-center text-white font-black text-sm shadow-xl shrink-0">
                                                {String.fromCharCode(64 + i)}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">1,240+ Verified Creators</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual - The "Media Kit" iPhone Reveal */}
                        <div className="relative lg:h-[800px] flex items-center justify-center animate-in fade-in slide-in-from-right duration-1000">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-violet-600/5 rounded-full blur-[100px] -z-10"></div>

                            {/* iPhone Mockup - The Centerpiece */}
                            <div className="relative w-full max-w-[340px] aspect-[9/18.5] bg-slate-900 rounded-[3rem] border-[10px] border-slate-800 dark:border-slate-700 shadow-[0_0_100px_rgba(124,58,237,0.3)] overflow-hidden">
                                {/* Internal Media Kit Mock */}
                                <div className="w-full h-full bg-white dark:bg-slate-950 overflow-y-auto no-scrollbar">
                                    <div className="h-48 w-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white p-6">
                                        <div className="text-center">
                                            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md mx-auto mb-3 flex items-center justify-center border border-white/30 text-3xl font-black">A</div>
                                            <h3 className="text-xl font-black leading-none">Anaya Verma</h3>
                                            <p className="text-[10px] font-bold opacity-75 mt-1 uppercase tracking-widest">Fashion & Lifestyle</p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <p className="text-xs font-black">156K</p>
                                                <p className="text-[8px] font-bold uppercase text-muted-foreground">Followers</p>
                                            </div>
                                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <p className="text-xs font-black text-emerald-600">8.4%</p>
                                                <p className="text-[8px] font-bold uppercase text-muted-foreground">Engagement</p>
                                            </div>
                                        </div>
                                        <div className="aspect-video w-full rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4 overflow-hidden relative group">
                                            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                                <Play className="h-10 w-10 fill-white" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-2 w-[80%] bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            <div className="h-2 w-[60%] bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stat Cards for "WOW" factor - Hidden on mobile to avoid overlap */}
                            <div className="absolute -left-12 top-24 transform animate-bounce duration-[3000ms] hidden sm:block">
                                <Card className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-emerald-500/20 shadow-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600">
                                            <TrendingUp className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black leading-none">+254%</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-80 mt-1">Growth Index</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <div className="absolute -right-16 bottom-32 transform animate-bounce duration-[4000ms] hidden sm:block">
                                <Card className="p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border-4 border-violet-500/10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/40">
                                            <Instagram className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold opacity-75">Verification</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Check className="h-5 w-5 text-violet-600" strokeWidth={4} />
                                                <span className="text-lg font-black tracking-tight uppercase">Success</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Floating Brand Inquiry Card */}
                            <div className="absolute -right-8 top-12 scale-90 md:scale-100">
                                <Card className="p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/10 animate-pulse">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                            <Globe className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">New Inquiry</p>
                                            <p className="text-sm font-black mt-1">Unilever India contacted you!</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid - Ultra Premium Layout */}
            <section className="py-32 bg-slate-50/50 dark:bg-slate-900/20 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 sm:mb-24 max-w-4xl mx-auto">
                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-6 sm:mb-8 leading-none">The <span className="text-violet-600 italic underline decoration-violet-500/20 decoration-8 underline-offset-8">Standard</span> for Premium Creators</h2>
                        <p className="text-lg sm:text-xl text-muted-foreground font-medium">Join the next generation of influencers using data to win brand deals.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {[
                            { icon: Smartphone, title: "Mobile-First Kit", text: "Your portfolio is built for the brand manager's phone. Fast, fluid, and high-conversion.", color: "violet" },
                            { icon: Play, title: "Embed Live Reels", text: "No more stale screenshots. Show your content in motion with live Instagram reel embeds.", color: "pink" },
                            { icon: BarChart3, title: "Proof of Analytics", text: "Upload your Instagram insights. Show brands real data, not just public counts.", color: "blue" },
                            { icon: Award, title: "Verification Badge", text: "Get the GopGop Verified badge. Build instant trust with national and global brands.", color: "emerald" },
                            { icon: Globe, title: "Public Profile Link", text: "gopgop.in/yourname - One link to replace everything in your bio and pitch emails.", color: "amber" },
                            { icon: Rocket, title: "Direct Contact Portal", text: "Brands can contact you on WhatsApp or Email directly with one click. Zero commissions.", color: "indigo" }
                        ].map((feature, i) => (
                            <div key={i} className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 hover:border-violet-500 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(124,58,237,0.1)]">
                                <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-50 dark:bg-${feature.color}-950/30 flex items-center justify-center text-${feature.color}-600 mb-8 scale-110 group-hover:rotate-12 transition-all`}>
                                    <feature.icon className="h-8 w-8" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-lg text-muted-foreground font-medium leading-relaxed">{feature.text}</p>
                                <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center gap-2 text-violet-600 font-black text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn More <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Steps Section - Full Width High Contrast */}
            <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-violet-600/10 blur-[100px]-z-0"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1 max-w-2xl">
                            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-8 sm:mb-12 leading-none">How to <span className="text-violet-500 italic">Dominate</span></h2>
                            <div className="space-y-8 sm:space-y-12">
                                {[
                                    { step: "01", title: "Claim Your Identity", text: "Reserve your custom short URL. Add your niche, city, and bio." },
                                    { step: "02", title: "Feed the Content", text: "Link your top-performing reels. Showcase your style in seconds." },
                                    { step: "03", title: "Drop the Proof", text: "Upload your reach data. Let the numbers speak for themselves." }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="text-6xl md:text-8xl font-black text-white/10 group-hover:text-violet-600/40 transition-colors leading-none tracking-tighter">
                                            {step.step}
                                        </div>
                                        <div className="pt-2 md:pt-4">
                                            <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">{step.title}</h3>
                                            <p className="text-lg text-slate-400 font-medium max-w-sm">{step.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Card className="flex-1 p-2 rounded-[2.5rem] sm:rounded-[3.5rem] mt-12 bg-white/5 backdrop-blur-md border-[1px] border-white/10 shadow-[0_0_80px_rgba(124,58,237,0.2)]">
                            <div className="bg-slate-950 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 py-12 sm:py-16 text-center border border-white/5">
                                <Award className="h-12 w-12 sm:h-16 sm:w-16 text-violet-500 mx-auto mb-6 sm:mb-8 animate-bounce" />
                                <h3 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6 tracking-tight">Ready to Launch?</h3>
                                <p className="text-lg sm:text-xl text-slate-400 font-medium mb-8 sm:mb-12">Join 1,240+ creators leveling up their business today.</p>
                                <Link href="/creators/get-started">
                                    <Button size="lg" className="h-16 sm:h-20 w-full bg-violet-600 hover:bg-violet-700 text-white text-lg sm:text-xl font-black rounded-2xl sm:rounded-[1.75rem] shadow-xl shadow-violet-500/30 active:scale-95 transition-all">
                                        Build Free Media Kit
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing - Stunning Flat Impact */}
            <section className="py-32 bg-white dark:bg-[#020617]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                            {/* Free Card */}
                            <div className="p-8 sm:p-16 rounded-[2.5rem] sm:rounded-[4rem] bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-500">
                                <div>
                                    <Badge className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black mb-6 sm:mb-8 px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase">Essential</Badge>
                                    <h3 className="text-3xl sm:text-4xl font-black mb-2">Free <span className="text-slate-400 italic">Always.</span></h3>
                                    <p className="text-base sm:text-lg text-muted-foreground font-medium mb-8 sm:mb-12">Perfect for creators just starting their professional journey.</p>
                                    <div className="space-y-4 sm:space-y-6 mb-12 sm:mb-16">
                                        {["3 Live Reel Embeds", "Public GopGop.in Profile", "Basic Analytics Support", "Mobile Optimized Design"].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                    <Check className="h-3 w-3 text-slate-500" strokeWidth={4} />
                                                </div>
                                                <span className="text-lg font-bold text-slate-700 dark:text-slate-300">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Link href="/creators/get-started">
                                    <Button variant="outline" className="h-16 sm:h-20 w-full border-2 border-slate-300 dark:border-slate-700 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all">
                                        Start Building Now
                                    </Button>
                                </Link>
                            </div>

                            {/* Pro Card - The Centerpiece */}
                            <div className="p-8 sm:p-16 rounded-[2.5rem] sm:rounded-[4rem] bg-slate-950 text-white border-[6px] sm:border-[10px] border-violet-600/20 shadow-[0_50px_100px_rgba(124,58,237,0.15)] flex flex-col justify-between relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                                <div className="relative">
                                    <Badge className="bg-violet-600 text-white font-black mb-6 sm:mb-8 px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase shadow-lg shadow-violet-600/20">The Standard</Badge>
                                    <h3 className="text-3xl sm:text-4xl font-black mb-2">Creator <span className="text-violet-500 italic">Pro.</span></h3>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-5xl sm:text-6xl font-black tracking-tighter">₹99</span>
                                        <span className="text-lg sm:text-xl text-slate-400 font-bold italic">/ mo</span>
                                    </div>
                                    <p className="text-base sm:text-lg text-slate-400 font-medium mb-8 sm:mb-12">For serious creators ready to dominate brand collaborations.</p>
                                    <div className="space-y-4 sm:space-y-6 mb-12 sm:mb-16">
                                        {["10 Live Reel Embeds", "Verified Badge Icon ✨", "Analytics Proof Uploads", "Priority Support Access", "Custom Call-to-Actions", "Unlimited Profile Edits"].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-600/20">
                                                    <Check className="h-3 w-3 text-white" strokeWidth={4} />
                                                </div>
                                                <span className="text-lg font-black">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Link href="/creators/get-started">
                                    <Button className="h-20 w-full bg-white text-slate-950 hover:bg-violet-50 text-xl font-black rounded-3xl shadow-2xl group-hover:scale-[1.03] transition-all">
                                        Upgrade to Pro
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Final Strip */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y-2 border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center justify-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                        {["Premium Lifestyle", "Global Tech Network", "Modern Fashion", "Elite Fitness", "Luxury Travel"].map((brand, i) => (
                            <span key={i} className="text-2xl font-black uppercase tracking-[0.3em]">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Final Junkie Call */}
            <section className="py-32 text-center bg-white dark:bg-[#020617]">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Rocket className="h-16 w-16 text-violet-600 mx-auto mb-10" />
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 leading-none">Your Future is <span className="text-violet-600">GopGop.</span></h2>
                    <Link href="/creators/get-started">
                        <Button size="lg" className="h-20 sm:h-24 px-10 sm:px-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xl sm:text-3xl font-black rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 transition-all">
                            Launch Free Now
                        </Button>
                    </Link>
                    <p className="text-sm font-black text-muted-foreground uppercase tracking-widest mt-10">Trusted by 1,240+ professional creators</p>
                </div>
            </section>
        </main>
    );
}
