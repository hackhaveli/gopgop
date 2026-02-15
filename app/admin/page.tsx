"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Users,
    TrendingUp,
    DollarSign,
    Star,
    Search,
    Filter,
    Download,
    Settings,
    CheckCircle,
    Clock,
    BarChart3,
    UserCheck,
    Mail,
    Shield,
    Eye,
    Trash2,
    Edit,
    Send,
    AlertTriangle,
    Activity,
    FileText,
    Globe,
    Database,
    Server,
    Zap,
    Award,
    MessageSquare,
    Calendar,
    Plus,
    RefreshCw,
    MoreVertical,
    ArrowUp,
    ArrowDown,
    ArrowRight,
    Percent,
    ToggleLeft,
    XCircle,
    PauseCircle,
    PlayCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdminPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCreators, setSelectedCreators] = useState<number[]>([]);
    const [timeRange, setTimeRange] = useState("30days");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Enhanced Global Platform Controls
    const [platformControls, setPlatformControls] = useState({
        registrationsEnabled: true,
        trialPeriod: "7",
        globalMaintenance: false,
        autoApproveCreators: false,
        creatorPlanPrice: "99",
        brandPlanPrice: "999"
    });

    // Enhanced Mock Data
    const stats = {
        totalCreators: 1247,
        verifiedCreators: 856,
        pendingCreators: 23,
        totalBrands: 67,
        activeSubscriptions: 124,
        trialSubscriptions: 15,
        revenue: "₹1,24,580",
        revenueGrowth: 23.4,
        monthlyRecurring: "₹98,670",
        churnRate: 4.2,
        avgDealValue: "₹899",
        systemHealth: 99.8
    };

    const recentCreators = [
        { id: 1, name: "Priya Sharma", email: "priya@example.com", niche: "Food", city: "Mumbai", status: "pending", followers: "45K", engagement: "4.2%", joinedDate: "2 days ago", plan: "Free" },
        { id: 2, name: "Rahul Verma", email: "rahul@example.com", niche: "Fashion", city: "Delhi", status: "verified", followers: "78K", engagement: "5.8%", joinedDate: "5 days ago", plan: "Pro" },
        { id: 3, name: "Anjali Patel", email: "anjali@example.com", niche: "Tech", city: "Bangalore", status: "pending", followers: "32K", engagement: "3.9%", joinedDate: "1 day ago", plan: "Free" },
        { id: 4, name: "Karan Singh", email: "karan@example.com", niche: "Fitness", city: "Pune", status: "verified", followers: "91K", engagement: "6.2%", joinedDate: "12 days ago", plan: "Pro" },
        { id: 5, name: "Neha Reddy", email: "neha@example.com", niche: "Travel", city: "Hyderabad", status: "suspended", followers: "54K", engagement: "4.7%", joinedDate: "8 days ago", plan: "Pro" }
    ];

    const recentBrands = [
        { id: 1, name: "Zomato", email: "team@zomato.com", plan: "Pro", status: "active", joined: "2 days ago", searches: 45, contacted: 12, revenue: "₹999" },
        { id: 2, name: "Myntra", email: "influencer@myntra.com", plan: "Pro", status: "active", joined: "5 days ago", searches: 78, contacted: 23, revenue: "₹999" },
        { id: 3, name: "Swiggy", email: "marketing@swiggy.com", plan: "Trial", status: "trial", joined: "1 day ago", searches: 12, contacted: 3, revenue: "₹0" },
        { id: 4, name: "Nykaa", email: "collabs@nykaa.com", plan: "Pro", status: "active", joined: "12 days ago", searches: 134, contacted: 45, revenue: "₹999" }
    ];

    return (
        <main className="min-h-screen pt-20 bg-slate-50 dark:bg-[#020617]">
            <div className="container mx-auto px-4 py-8">
                {/* Header with Dashboard Switcher */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-violet-600 hover:bg-violet-700 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5">Admin Central</Badge>
                            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">v2.4.0</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Command <span className="text-violet-600">Center</span></h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-sm font-bold">API: 100%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-sm font-bold">DB: 100%</span>
                            </div>
                        </div>

                        <Button variant="outline" className="h-10 sm:h-12 rounded-2xl border-2 font-black shadow-sm group text-xs sm:text-base px-3 sm:px-4">
                            <RefreshCw className="h-4 w-4 mr-2 group-active:rotate-180 transition-transform" />
                            Sync
                        </Button>

                        <Button className="h-10 sm:h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black px-4 sm:px-6 shadow-xl hover:shadow-violet-500/10 text-xs sm:text-base">
                            <Plus className="h-5 w-5 mr-2" />
                            Action
                        </Button>
                    </div>
                </div>

                {/* Global Platform Control Center */}
                <Card className="p-8 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm mb-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 border border-amber-100 dark:border-amber-900/50">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">Platform Controls</h2>
                            <p className="text-sm text-muted-foreground font-medium">Real-time global configuration (Overrides all defaults)</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div className="space-y-1">
                                    <Label className="font-bold text-xs uppercase tracking-wider">New Registrations</Label>
                                    <p className="text-[10px] text-muted-foreground">Allow new users to sign up</p>
                                </div>
                                <Switch checked={platformControls.registrationsEnabled} onCheckedChange={(val) => setPlatformControls({ ...platformControls, registrationsEnabled: val })} />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div className="space-y-1">
                                    <Label className="font-bold text-xs uppercase tracking-wider">Maintenance Mode</Label>
                                    <p className="text-[10px] text-muted-foreground">Global site lockdown</p>
                                </div>
                                <Switch checked={platformControls.globalMaintenance} onCheckedChange={(val) => setPlatformControls({ ...platformControls, globalMaintenance: val })} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-wider ml-1">Global Trial (Days)</Label>
                                <Input
                                    type="number"
                                    className="h-12 rounded-2xl border-2 font-bold"
                                    value={platformControls.trialPeriod}
                                    onChange={(e) => setPlatformControls({ ...platformControls, trialPeriod: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div className="space-y-1">
                                    <Label className="font-bold text-xs uppercase tracking-wider">Auto-Approve</Label>
                                    <p className="text-[10px] text-muted-foreground">Skip verification queue</p>
                                </div>
                                <Switch checked={platformControls.autoApproveCreators} onCheckedChange={(val) => setPlatformControls({ ...platformControls, autoApproveCreators: val })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-wider ml-1">Creator Subscription (₹)</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                                <Input
                                    type="number"
                                    className="h-12 pl-10 rounded-2xl border-2 font-black text-lg"
                                    value={platformControls.creatorPlanPrice}
                                    onChange={(e) => setPlatformControls({ ...platformControls, creatorPlanPrice: e.target.value })}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold px-1">Currently: ₹99/mo</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-wider ml-1">Brand Subscription (₹)</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                                <Input
                                    type="number"
                                    className="h-12 pl-10 rounded-2xl border-2 font-black text-lg"
                                    value={platformControls.brandPlanPrice}
                                    onChange={(e) => setPlatformControls({ ...platformControls, brandPlanPrice: e.target.value })}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold px-1">Currently: ₹999/mo</p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button className="h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black px-8">
                            Update Global Config
                        </Button>
                    </div>
                </Card>

                {/* Stats Grid - High Impact */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-10">
                    {[
                        { label: "Total Creators", value: stats.totalCreators.toLocaleString(), icon: Users, color: "violet", trend: "+12.3%", trendUp: true, sub: "High Quality" },
                        { label: "Verified", value: stats.verifiedCreators.toLocaleString(), icon: UserCheck, color: "emerald", trend: "+8.2%", trendUp: true, sub: "Proof Uploaded" },
                        { label: "Total Brands", value: stats.totalBrands.toLocaleString(), icon: TrendingUp, color: "blue", trend: "+5.1%", trendUp: true, sub: "Premium Only" },
                        { label: "Revenue", value: stats.revenue, icon: DollarSign, color: "pink", trend: `+${stats.revenueGrowth}%`, trendUp: true, sub: "Month to Date" },
                        { label: "Avg Ticket", value: stats.avgDealValue, icon: Star, color: "amber", trend: "+2.4%", trendUp: true, sub: "Brand Value" },
                        { label: "System", value: `${stats.systemHealth}%`, icon: Shield, color: "slate", trend: "0.0%", trendUp: true, sub: "Operational" }
                    ].map((metric, i) => (
                        <Card key={i} className="p-6 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[1.75rem] transition-all hover:scale-[1.02] cursor-default active:scale-[0.98]">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl bg-${metric.color}-50 dark:bg-${metric.color}-950/30 flex items-center justify-center text-${metric.color}-600`}>
                                    <metric.icon className="h-5 w-5" />
                                </div>
                                <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${metric.trendUp ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-red-50 dark:bg-red-950/30 text-red-600'}`}>
                                    {metric.trend}
                                </div>
                            </div>
                            <div className="text-3xl font-black tracking-tighter mb-1 font-mono">{metric.value}</div>
                            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{metric.label}</div>
                            <div className="text-[10px] text-violet-600 dark:text-violet-400 font-bold mt-1 opacity-70 italic">{metric.sub}</div>
                        </Card>
                    ))}
                </div>

                {/* Main Content Interface */}
                <Tabs defaultValue="creators" className="space-y-8">
                    <TabsList className="w-full flex flex-wrap gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-[1.5rem] border-2 border-slate-200 dark:border-slate-800 h-auto self-center mx-auto justify-center sm:grid sm:grid-cols-5 sm:max-w-4xl">
                        <TabsTrigger value="creators" className="flex-1 min-w-[100px] rounded-xl py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all">
                            Creators
                        </TabsTrigger>
                        <TabsTrigger value="brands" className="flex-1 min-w-[100px] rounded-xl py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
                            Brands
                        </TabsTrigger>
                        <TabsTrigger value="payouts" className="flex-1 min-w-[100px] rounded-xl py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all">
                            Payouts
                        </TabsTrigger>
                        <TabsTrigger value="support" className="flex-1 min-w-[100px] rounded-xl py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-all">
                            Tickets
                        </TabsTrigger>
                        <TabsTrigger value="logs" className="flex-1 min-w-[100px] rounded-xl py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
                            Logs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="creators" className="space-y-6">
                        <Card className="p-8 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem]">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight mb-2">Creator Directory</h2>
                                    <p className="text-muted-foreground font-medium">Verify content, manage plans, and handle suspensions in bulk.</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                    <div className="relative group flex-1 sm:flex-none">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-violet-600 transition-colors" />
                                        <Input
                                            placeholder="Search..."
                                            className="h-12 w-full sm:w-[300px] pl-12 rounded-2xl border-2 font-bold focus-visible:ring-violet-600"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" className="h-12 w-12 rounded-2xl border-2 p-0"><Filter className="h-5 w-5" /></Button>
                                    <Button className="h-12 flex-1 sm:flex-none rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black px-6 shadow-lg shadow-violet-500/20">
                                        Batch Action
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-separate border-spacing-y-3">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            <th className="px-6 py-4 text-left">Creator</th>
                                            <th className="px-6 py-4 text-left">Stats</th>
                                            <th className="px-6 py-4 text-left">Tier</th>
                                            <th className="px-6 py-4 text-left">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentCreators.map((creator) => (
                                            <tr key={creator.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-3xl">
                                                <td className="px-6 py-4 bg-white dark:bg-slate-900 group-hover:bg-transparent first:rounded-l-2xl border-y border-l border-slate-100 dark:border-slate-800 group-hover:border-violet-500/30">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900 dark:to-violet-800 flex items-center justify-center text-violet-700 dark:text-violet-200 font-black text-lg border-2 border-white dark:border-slate-800 shadow-sm">
                                                            {creator.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 dark:text-white leading-none">{creator.name}</p>
                                                            <p className="text-xs font-bold text-muted-foreground mt-1">@{creator.email.split('@')[0]}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 bg-white dark:bg-slate-900 group-hover:bg-transparent border-y border-slate-100 dark:border-slate-800 group-hover:border-violet-500/30">
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <p className="text-xs font-black">{creator.followers}</p>
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Followers</p>
                                                        </div>
                                                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
                                                        <div>
                                                            <p className="text-xs font-black text-emerald-600">{creator.engagement}</p>
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Engagement</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 bg-white dark:bg-slate-900 group-hover:bg-transparent border-y border-slate-100 dark:border-slate-800 group-hover:border-violet-500/30">
                                                    <Badge className={creator.plan === 'Pro' ? 'bg-violet-600 shadow-md shadow-violet-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}>
                                                        {creator.plan}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 bg-white dark:bg-slate-900 group-hover:bg-transparent border-y border-slate-100 dark:border-slate-800 group-hover:border-violet-500/30">
                                                    <div className="flex items-center gap-2">
                                                        {creator.status === 'verified' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                                                        {creator.status === 'pending' && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                                                        {creator.status === 'suspended' && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                                                        <span className="text-xs font-black uppercase tracking-widest">{creator.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 bg-white dark:bg-slate-900 group-hover:bg-transparent last:rounded-r-2xl border-y border-r border-slate-100 dark:border-slate-800 group-hover:border-violet-500/30">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-950/30 text-violet-600"><Eye className="h-5 w-5" /></Button>
                                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-950/30 text-blue-600"><Edit className="h-5 w-5" /></Button>
                                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/30 text-red-600"><XCircle className="h-5 w-5" /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-xs sm:text-sm font-bold text-muted-foreground italic text-center sm:text-left">Page 1 of 48. Total: 1,247 creators registered.</p>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <Button variant="outline" className="h-9 px-2 sm:px-4 rounded-xl border-2 font-black text-xs sm:text-sm text-slate-400">Prev</Button>
                                    <Button variant="outline" className="h-9 px-2 sm:px-4 rounded-xl border-2 font-black bg-violet-600 text-white border-violet-600 text-xs sm:text-sm">1</Button>
                                    <Button variant="outline" className="h-9 px-2 sm:px-4 rounded-xl border-2 font-black text-xs sm:text-sm">2</Button>
                                    <Button variant="outline" className="h-9 px-2 sm:px-4 rounded-xl border-2 font-black text-xs sm:text-sm">3</Button>
                                    <Button variant="outline" className="h-9 px-2 sm:px-4 rounded-xl border-2 font-black text-xs sm:text-sm">Next</Button>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Logs Tab - Detailed Stats */}
                    <TabsContent value="logs" className="space-y-6">
                        <div className="grid lg:grid-cols-2 gap-8">
                            <Card className="p-8 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem]">
                                <h3 className="text-2xl font-black mb-6">Real-Time Traffic</h3>
                                <div className="space-y-4">
                                    {[
                                        { event: "New Signup", user: "ananya_reels", time: "2s ago", type: "success" },
                                        { event: "Plan Upgrade", user: "tech_guru", time: "12m ago", type: "premium" },
                                        { event: "Brand Search", user: "Zomato Team", time: "14m ago", type: "search" },
                                        { event: "Profile Update", user: "foodie_mumbai", time: "1h ago", type: "info" },
                                    ].map((log, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'premium' ? 'bg-violet-500' : 'bg-blue-500'}`}></div>
                                                <div>
                                                    <p className="text-sm font-black">{log.event}</p>
                                                    <p className="text-xs text-muted-foreground font-bold">{log.user}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-slate-400">{log.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-8 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem]">
                                <h3 className="text-2xl font-black mb-6">Quick Tools</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Button className="h-24 flex flex-col items-center justify-center gap-2 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black">
                                        <Send className="h-6 w-6" />
                                        Send Global Mail
                                    </Button>
                                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 rounded-3xl border-2 font-black border-red-200 text-red-600 hover:bg-red-50">
                                        <PauseCircle className="h-6 w-6" />
                                        Emergency Stop
                                    </Button>
                                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 rounded-3xl border-2 font-black border-blue-200 text-blue-600 hover:bg-blue-50">
                                        <Award className="h-6 w-6" />
                                        Feature a Creator
                                    </Button>
                                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 rounded-3xl border-2 font-black">
                                        <Settings className="h-6 w-6" />
                                        System Config
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
