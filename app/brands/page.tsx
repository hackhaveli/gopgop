import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Check, Search, TrendingUp, Zap, Target, ArrowRight, Filter,
    Download, MessageSquare, BarChart3, Shield, Sparkles, Users,
    Clock, Award, Rocket, Play, Layers, ShieldCheck, Database, Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
    title: "GopGop | Data-Driven Influencer Discovery for Brands",
    description: "Find high-performing micro-influencers with verified proof. Skip the agencies. Direct contact. 100% authentic data.",
};

export default function BrandsPage() {
    return (
        <main className="min-h-screen pt-20 bg-white dark:bg-[#020617] overflow-hidden">
            {/* Hero Section - The Discovery Engine */}
            <section className="relative py-24 md:py-32 xl:py-48">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-l from-blue-100/50 via-transparent to-transparent dark:from-blue-950/20 pointer-events-none"></div>
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
                        {/* Left Content */}
                        <div className="animate-in fade-in slide-in-from-left duration-1000">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 shadow-sm mb-8">
                                <ShieldCheck className="h-4 w-4 text-blue-600" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">Enterprise Discovery Engine</span>
                            </div>

                            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-slate-900 dark:text-white">
                                Find <span className="text-blue-600 italic underline decoration-blue-500/20 decoration-8">Proven</span> Talent In Seconds.
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium mb-12 max-w-xl leading-relaxed">
                                Skip the agencies. Access <span className="text-slate-900 dark:text-white font-black underline decoration-blue-500/30 decoration-4">1,240+ verified creators</span> with real performance data. Zero commissions. 100% direct contact.
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-12">
                                <Link href="/brands/dashboard">
                                    <Button size="lg" className="h-16 sm:h-20 px-6 sm:px-10 bg-blue-600 hover:bg-blue-700 text-white text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                                        Search Creators Now
                                        <Search className="ml-3 h-5 w-5 sm:h-6 sm:w-6" strokeWidth={3} />
                                    </Button>
                                </Link>
                                <Link href="#trial">
                                    <Button size="lg" variant="outline" className="h-16 sm:h-20 px-6 sm:px-10 border-2 border-slate-200 dark:border-slate-800 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all w-full sm:w-auto">
                                        Start 7-Day Free Trial
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats Strip */}
                            <div className="grid grid-cols-3 gap-8">
                                <div>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white">1,240+</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Verified Creators</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white">50+</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Active Brands</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-blue-600">10min</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Avg. Collab Match</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual - The "Discovery UI" Preview */}
                        <div className="relative animate-in fade-in slide-in-from-right duration-1000">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/5 rounded-full blur-[120px]-z-10"></div>

                            <Card className="p-8 pb-0 rounded-[3rem] border-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                            <Search className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black italic text-slate-900 dark:text-white">Discovery System</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Filtered by "Mumbai • Food"</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider text-[10px] px-3 py-1">Live Engine</Badge>
                                </div>

                                <div className="grid grid-cols-1 gap-6 mb-8">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center gap-6 group hover:border-blue-500 transition-colors cursor-pointer">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-800 flex items-center justify-center font-black text-xl text-blue-700 dark:text-blue-100 shadow-sm">
                                                {i === 1 ? "R" : "V"}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{i === 1 ? "Rohan Mehta" : "Vani Kapoor"}</h4>
                                                    <ShieldCheck className="h-4 w-4 text-blue-600 fill-blue-500/10" />
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                    <span>{i === 1 ? "45K Followers" : "120K Followers"}</span>
                                                    <span className="text-emerald-600">{i === 1 ? "7.2% Eng" : "9.8% Eng"}</span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl text-blue-600 hover:bg-blue-50"><MessageSquare className="h-5 w-5" /></Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Mock Activity Feed in UI */}
                                <div className="p-6 bg-slate-900 dark:bg-slate-800 rounded-t-[2.5rem] mt-4 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><BarChart3 className="h-4 w-4 text-blue-400" /></div>
                                            <span className="text-xs font-bold text-slate-300">Campaign Performance</span>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-500">+14.2% Growth</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Absolute Overlays for "Stunning" factor - Hidden/Scaled on mobile */}
                            <div className="absolute -left-12 bottom-12 scale-90 hidden sm:block">
                                <Card className="p-4 rounded-2xl bg-emerald-500 text-white shadow-2xl border-2 border-white/20">
                                    <div className="flex items-center gap-3">
                                        <Check className="h-5 w-5 fill-white" strokeWidth={4} />
                                        <span className="text-sm font-black uppercase tracking-tight">Data Verified</span>
                                    </div>
                                </Card>
                            </div>

                            <div className="absolute -top-12 -right-8 animate-bounce delay-500 hidden sm:block">
                                <Card className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl border-4 border-blue-500/10">
                                    <div className="text-center">
                                        <p className="text-4xl font-black text-blue-600 leading-none">0%</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">Commission Fees</p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Discovery Multiplier Grid */}
            <section className="py-32 bg-slate-50 dark:bg-slate-900/10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 sm:mb-24 max-w-4xl mx-auto">
                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-6 sm:mb-8 leading-none">Designed for <span className="text-blue-600 italic">Scale.</span></h2>
                        <p className="text-lg sm:text-xl text-muted-foreground font-medium">Standard influencer databases are messy. GopGop is curated, verified, and ready-to-contact.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                        {[
                            { icon: Filter, title: "Deep Discovery UI", text: "Filter by city, niche, followers, AND average views. Find creators who actually reach your audience.", color: "blue" },
                            { icon: Database, title: "Verified Performance", text: "View internal screenshots of Instagram insights shared by creators. Stop guessing on engagement.", color: "indigo" },
                            { icon: MessageSquare, title: "Direct WhatsApp", text: "Get direct phone numbers and emails. No platform gatekeeping. Negotiate and close your way.", color: "emerald" },
                            { icon: Layers, title: "Shortlist Manager", text: "Organize creators into campaign folders. Export contacts as CSV for your CRM or team collaboration.", color: "orange" },
                            { icon: ChartBarIcon, title: "ROI Tracking", text: "Monitor response rates and collaboration success. Build a database of high-performing creators.", color: "pink" },
                            { icon: ShieldCheck, title: "Authenticity Guard", text: "We manually verify every pro profile. No bots, no ghost followers, no fake engagement stats.", color: "slate" }
                        ].map((feature, i) => (
                            <div key={i} className="group p-10 rounded-[3rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all duration-500 hover:shadow-[0_4px_60px_rgba(37,99,235,0.08)]">
                                <div className={`w-14 h-14 rounded-2xl bg-${i === 2 ? 'emerald' : 'blue'}-50 dark:bg-${i === 2 ? 'emerald' : 'blue'}-950/30 flex items-center justify-center text-${i === 2 ? 'emerald' : 'blue'}-600 mb-8`}>
                                    <feature.icon className="h-7 w-7" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight uppercase leading-none">{feature.title}</h3>
                                <p className="text-lg text-muted-foreground font-medium leading-relaxed">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trial Impact - Blue Focus */}
            <section id="trial" className="py-32 bg-blue-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                            <div className="flex-1 text-left">
                                <Badge className="bg-white/20 text-white font-black mb-8 px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase">Limited Offer</Badge>
                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">Start Finding <br />For <span className="italic">Free.</span></h2>
                                <p className="text-2xl font-medium text-white/80 max-w-xl mb-12">Get 7 days of full platform access. No credit card. Unlimited discovery. Start your campaign today.</p>

                                <div className="flex flex-col gap-6">
                                    {["Full Access to 1,240+ Creators", "Advanced Filter Engine", "Direct Contact Info", "CSV Contact Export"].map((feat, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <Check className="h-6 w-6 text-white stroke-[4]" />
                                            <span className="text-xl font-black">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Card className="flex-1 p-2 rounded-[2.5rem] sm:rounded-[3.5rem] bg-white text-slate-900 shadow-2xl">
                                <div className="p-8 sm:p-12 text-center">
                                    <h3 className="text-2xl sm:text-3xl font-black mb-2 uppercase tracking-tighter">7-Day Free Trial</h3>
                                    <p className="text-base sm:text-lg font-bold text-muted-foreground mb-8 sm:mb-10 italic">Zero risk. High reward.</p>

                                    <div className="space-y-4 mb-10">
                                        <div className="text-sm font-bold opacity-60">PRICE AFTER TRIAL</div>
                                        <div className="text-5xl sm:text-6xl font-black tracking-tighter">₹999<span className="text-lg text-muted-foreground italic tracking-normal">/mo</span></div>
                                    </div>

                                    <Link href="/brands/dashboard">
                                        <Button className="h-16 sm:h-24 w-full bg-blue-600 hover:bg-blue-700 text-white text-lg sm:text-2xl font-black rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-500/20 group transition-all">
                                            Activate Trial Now
                                            <ArrowRight className="ml-4 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform" />
                                        </Button>
                                    </Link>
                                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest mt-6 sm:mt-8 opacity-40 italic">Cancel anytime. No commitment.</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Verified Section - Trust Focus */}
            <section className="py-32 bg-white dark:bg-[#020617] text-center">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="w-24 h-24 rounded-[2rem] bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 mx-auto mb-10 border-4 border-blue-500/20 shadow-xl">
                        <ShieldCheck className="h-12 w-12" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">The Most <span className="text-blue-600 italic">Trusted</span> Database.</h2>
                    <p className="text-xl text-muted-foreground font-medium mb-16 italic">"GopGop saved us a week of research and ₹20,000 in agency fees for our last campaign."</p>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <div className="text-left">
                            <p className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Marketing Head</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Leading QSR Brand</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Discovery Call */}
            <section className="py-32 bg-slate-50 dark:bg-slate-900/40 text-center border-t-2 border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl md:text-6xl font-black tracking-tighter mb-12">Search. Discover. <span className="text-blue-600">Scale.</span></h2>
                    <Link href="/brands/dashboard">
                        <Button size="lg" className="h-20 sm:h-24 px-10 sm:px-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xl sm:text-3xl font-black rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all">
                            Start Discovery
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}

// Fixed missing icon
function ChartBarIcon(props: any) {
    return <BarChart3 {...props} />
}
