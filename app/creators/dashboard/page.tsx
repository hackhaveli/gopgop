"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    User,
    Video,
    BarChart3,
    Settings,
    Plus,
    ExternalLink,
    Copy,
    CheckCircle2,
    TrendingUp,
    Users,
    Eye,
    MessageSquare,
    Share2,
    Calendar,
    Sparkles,
    Instagram,
    Loader2,
    AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface CreatorProfile {
    id: string;
    display_name: string;
    username: string;
    bio?: string;
    niche?: string;
    city?: string;
    whatsapp?: string;
    contact_email?: string;
    instagram_followers?: number;
    instagram_engagement_rate?: number;
    plan_type?: string;
    created_at: string;
    updated_at: string;
}

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function CreatorDashboard() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any | null>(null);
    const [reels, setReels] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [inquiryCount, setInquiryCount] = useState(0);
    const [currentView, setCurrentView] = useState('overview');
    const [stats, setStats] = useState({
        views: "0",
        followers: "0",
        engagement: "0%",
        shares: "0"
    });
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [addReelModal, setAddReelModal] = useState(false);
    const [editReelModal, setEditReelModal] = useState(false);
    const [editingReel, setEditingReel] = useState<any | null>(null);
    const [newReel, setNewReel] = useState({ url: "", title: "", views: "", likes: "", shares: "" });
    const [addingReel, setAddingReel] = useState(false);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [settings, setSettings] = useState({
        display_name: "",
        city: "",
        whatsapp: "",
        contact_email: "",
        bio: "",
        instagram_followers: "",
        instagram_engagement_rate: ""
    });

    const [activeChat, setActiveChat] = useState<any | null>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (chatMessages.length > 0) {
            scrollToBottom();
        }
    }, [chatMessages]);

    useEffect(() => {
        if (!activeChat) return;

        const fetchMessages = async () => {
            const response = await fetch(`/api/inquiries/${activeChat.id}/messages`);
            const result = await response.json();
            if (result.success) {
                setChatMessages(result.data);
            }
        };

        fetchMessages();

        // Realtime listener
        const channel = supabase
            .channel(`messages:${activeChat.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `inquiry_id=eq.${activeChat.id}`
                },
                (payload) => {
                    setChatMessages((prev) => {
                        if (prev.some(m => m.id === payload.new.id)) return prev;

                        const tempMsgIndex = prev.findIndex(m => m.is_temp && m.content === payload.new.content && m.sender_id === payload.new.sender_id);
                        if (tempMsgIndex !== -1) {
                            const newMessages = [...prev];
                            newMessages[tempMsgIndex] = payload.new;
                            return newMessages;
                        }

                        return [...prev, payload.new];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeChat, supabase]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeChat || !newMessage.trim() || !profile) return;

        const content = newMessage.trim();
        setNewMessage("");

        // Optimistic update
        const optimisticMsg = {
            id: 'temp-' + Date.now(),
            inquiry_id: activeChat.id,
            sender_id: profile.user_id,
            content: content,
            created_at: new Date().toISOString(),
            is_temp: true
        };

        setChatMessages(prev => [...prev, optimisticMsg as any]);

        try {
            setSendingMessage(true);
            const response = await fetch(`/api/inquiries/${activeChat.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });

            const result = await response.json();
            if (!result.success) {
                setChatMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
                toast.error(result.message || "Failed to send message");
                setNewMessage(content);
            }
        } catch (error) {
            setChatMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
            toast.error("An error occurred");
            setNewMessage(content);
        } finally {
            setSendingMessage(false);
        }
    };

    useEffect(() => {
        if (profile) {
            setSettings({
                display_name: profile.display_name || "",
                city: profile.city || "",
                whatsapp: profile.whatsapp || "",
                contact_email: profile.contact_email || "",
                bio: profile.bio || "",
                instagram_followers: profile.instagram_followers?.toString() || "0",
                instagram_engagement_rate: profile.instagram_engagement_rate?.toString() || "0"
            });
        }
    }, [profile]);

    const handleUpdateProfile = async () => {
        if (!profile) return;

        try {
            setUpdatingProfile(true);
            const response = await fetch(`/api/creators/${profile.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...settings,
                    instagram_followers: parseInt(settings.instagram_followers) || 0,
                    instagram_engagement_rate: parseFloat(settings.instagram_engagement_rate) || 0
                })
            });

            const result = await response.json();
            if (result.success) {
                toast.success("Profile updated successfully!");
                setProfile(result.data);
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred while updating profile.");
        } finally {
            setUpdatingProfile(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Get current user
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError || !user) {
                    router.push("/auth/login");
                    return;
                }

                // 2. Get creator profile
                const { data: profileData, error: profileError } = await supabase
                    .from('creator_profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (profileError || !profileData) {
                    console.error("Profile error:", profileError);
                    setError("Could not find your creator profile. Please complete your registration.");
                    setLoading(false);
                    return;
                }

                const typedProfile = profileData as CreatorProfile;
                setProfile(typedProfile);

                // 3. Get reels
                const { data: reelsData, error: reelsError } = await (supabase
                    .from('creator_reels')
                    .select('*')
                    .eq('creator_id', typedProfile.id)
                    .order('created_at', { ascending: false }) as any);

                if (!reelsError && reelsData) {
                    setReels(reelsData);
                }

                // 4. Get inquiries
                const { data: inquiriesData, error: inqError } = await (supabase
                    .from('inquiries')
                    .select(`
                        *,
                        brand:brand_profiles(*)
                    `)
                    .eq('creator_id', typedProfile.id)
                    .order('created_at', { ascending: false }) as any);

                if (!inqError && inquiriesData) {
                    setInquiries(inquiriesData);
                    setInquiryCount((inquiriesData as any[]).filter((i: any) => i.status === 'pending').length);
                }

                // 5. Calculate real stats from reels
                const totalViews = (reelsData as any[])?.reduce((sum: number, r: any) => sum + (r.views || 0), 0) || 0;
                setStats({
                    views: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews.toString(),
                    followers: typedProfile.instagram_followers?.toLocaleString() || "0",
                    engagement: typedProfile.instagram_engagement_rate ? `${typedProfile.instagram_engagement_rate}%` : "0%",
                    shares: (reelsData as any[])?.reduce((sum: number, r: any) => sum + (r.shares || 0), 0).toString() || "0"
                });

                setLoading(false);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("An unexpected error occurred.");
                setLoading(false);
            }
        };

        const fetchDataAndListen = async () => {
            await fetchData();

            const channel = supabase
                .channel('public:inquiries')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'inquiries'
                    },
                    () => {
                        fetchData(); // Refresh data on any changes
                    }
                )
                .subscribe();

            return channel;
        };

        const channelPromise = fetchDataAndListen();

        return () => {
            channelPromise.then(channel => {
                if (channel) supabase.removeChannel(channel);
            });
        };
    }, [router, supabase]);

    const handleDeleteReel = async (reelId: string) => {
        if (!confirm("Are you sure you want to delete this reel?")) return;

        try {
            const response = await fetch(`/api/creators/${profile?.id}/reels?reelId=${reelId}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (result.success) {
                toast.success("Reel deleted successfully!");
                setReels(reels.filter(r => r.id !== reelId));
            } else {
                toast.error(result.message || "Failed to delete reel");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the reel.");
        }
    };

    const handleUpdateReel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReel || !profile) return;

        try {
            setAddingReel(true);
            const response = await fetch(`/api/creators/${profile.id}/reels/${editingReel.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editingReel.title,
                    views: parseInt(editingReel.views.toString()),
                    likes: parseInt(editingReel.likes.toString()),
                    shares: parseInt(editingReel.shares?.toString() || "0")
                })
            });

            const result = await response.json();
            if (result.success) {
                toast.success("Reel updated successfully!");
                // Re-fetch or update local state
                setReels(reels.map(r => r.id === editingReel.id ? result.data : r));
                setEditReelModal(false);
                setEditingReel(null);
            } else {
                toast.error(result.message || "Failed to update reel");
            }
        } catch (error) {
            toast.error("An error occurred while updating the reel.");
        } finally {
            setAddingReel(false);
        }
    };

    const handleUpdateInquiryStatus = async (inqId: string, status: string) => {
        try {
            const response = await fetch(`/api/inquiries`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inquiry_id: inqId, status })
            });

            const result = await response.json();
            if (result.success) {
                setInquiries(inquiries.map(i => i.id === inqId ? { ...i, status } : i));
                if (status === 'accepted') {
                    toast.success("Inquiry accepted! Opening chat...");
                    const acceptedInq = inquiries.find(i => i.id === inqId);
                    if (acceptedInq) {
                        setActiveChat({ ...acceptedInq, status: 'accepted' });
                    }
                }
                setInquiryCount(prev => status === 'accepted' ? prev - 1 : prev);
            }
        } catch (error) {
            toast.error("Failed to update inquiry");
        }
    };

    const copyLink = () => {
        if (!profile) return;
        const url = `${window.location.origin}/c/${profile.username}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-violet-600 mx-auto mb-4" />
                    <p className="text-lg font-bold text-slate-600 dark:text-slate-400">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] p-4">
                <Card className="p-8 max-w-md w-full text-center space-y-6 rounded-[2.5rem] border-2 border-red-100 dark:border-red-950/30 shadow-2xl">
                    <div className="h-20 w-20 rounded-3xl bg-red-50 dark:bg-red-950/30 text-red-600 mx-auto flex items-center justify-center">
                        <AlertCircle className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">{error}</h2>
                    <div className="flex flex-col gap-3">
                        <Link href="/creators/onboarding">
                            <Button className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-2xl">
                                Setup Profile
                            </Button>
                        </Link>
                        <Button variant="outline" className="h-14 rounded-2xl font-bold" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const handleAddReel = async () => {
        if (!profile || !newReel.url || !newReel.title) {
            toast.error("Please fill in the URL and Title");
            return;
        }

        try {
            setAddingReel(true);
            const response = await fetch(`/api/creators/${profile.id}/reels`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform: 'instagram',
                    reel_url: newReel.url,
                    thumbnail_url: "", // Placeholder
                    views: parseInt(newReel.views) || 0,
                    likes: parseInt(newReel.likes) || 0,
                    shares: parseInt(newReel.shares) || 0,
                    title: newReel.title
                })
            });

            const result = await response.json();
            if (result.success) {
                setReels([result.data, ...reels]);
                toast.success("Reel added successfully!");
                setAddReelModal(false);
                setNewReel({ url: "", title: "", views: "", likes: "", shares: "" });
            } else {
                toast.error(result.message || "Failed to add reel");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setAddingReel(false);
        }
    };

    const initials = profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || "C";

    return (
        <div className="relative min-h-screen pt-24 pb-12 overflow-hidden">
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

            <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-violet-600/10 text-violet-600 border-violet-600/20 px-3 py-1">
                                Creator Dashboard
                            </Badge>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live Now
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                            Welcome back, <span className="bg-gradient-to-r from-violet-600 via-pink-600 to-violet-500 bg-clip-text text-transparent">{profile?.display_name || profile?.username}!</span>
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium mt-2">
                            Your media kit is looking strong. Time to land some deals!
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentView('inquiries')}
                            className="relative h-12 w-12 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-slate-600 dark:text-slate-400 hover:text-violet-600 transition-all"
                        >
                            <MessageSquare className="h-6 w-6" />
                            {inquiryCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black ring-4 ring-white dark:ring-slate-950">
                                    {inquiryCount}
                                </span>
                            )}
                        </Button>
                        <Button
                            onClick={copyLink}
                            className="rounded-2xl h-12 px-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
                        >
                            {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                            {copied ? "Copied!" : "Copy Kit Link"}
                        </Button>
                        <Link href={`/c/${profile?.username}`}>
                            <Button className="rounded-2xl h-12 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold gap-2 shadow-xl hover:scale-105 transition-all">
                                <ExternalLink className="h-4 w-4" />
                                View Public Kit
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Sidebar - Navigation/Profile */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white text-2xl font-black mb-6 shadow-xl shadow-violet-500/20">
                                    {initials}
                                </div>
                                <h3 className="text-xl font-black tracking-tight line-clamp-1">{profile?.display_name}</h3>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">@{profile?.username}</p>

                                <div className="space-y-1">
                                    {[
                                        { icon: LayoutDashboard, label: "Overview", id: 'overview' },
                                        { icon: Video, label: "My Reels", id: 'reels' },
                                        { icon: MessageSquare, label: "Inquiries", id: 'inquiries', badge: inquiryCount > 0 ? inquiryCount.toString() : "0" },
                                        { icon: Settings, label: "Settings", id: 'settings' },
                                    ].map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentView(item.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-bold text-sm ${currentView === item.id
                                                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-4 w-4" strokeWidth={2.5} />
                                                {item.label}
                                            </div>
                                            {item.badge !== "0" && item.badge && (
                                                <span className="bg-pink-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-slate-950 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <Sparkles className="h-5 w-5 text-violet-400 animate-pulse" />
                            </div>
                            <h4 className="text-lg font-black mb-2">Creator <span className="text-violet-500">{profile?.plan_type === 'pro' ? 'Pro' : 'Free'}</span></h4>
                            <p className="text-sm text-slate-400 font-medium mb-6">
                                {profile?.plan_type === 'pro' ? 'You are on the professional plan.' : 'Upgrade to unlock deep analytics.'}
                            </p>
                            <Progress value={profile?.bio ? 90 : 40} className="h-2 bg-slate-800 mb-2" />
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
                                {profile?.bio ? '90%' : '40%'} profile strength
                            </p>
                            {!profile?.bio && (
                                <Button
                                    size="sm"
                                    className="w-full bg-white text-slate-950 hover:bg-violet-50 font-black rounded-xl"
                                    onClick={() => setCurrentView('settings')}
                                >
                                    Complete Profile
                                </Button>
                            )}
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {currentView === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    {/* Quick Stats Grid */}
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { icon: Eye, label: "Kit Views", value: stats.views, trend: "Live", color: "blue" },
                                            { icon: Users, label: "Followers", value: stats.followers, trend: "Live", color: "violet" },
                                            { icon: TrendingUp, label: "Engagement", value: stats.engagement, trend: "Live", color: "emerald" },
                                            { icon: Share2, label: "Total Shares", value: stats.shares, trend: "Live", color: "pink" },
                                        ].map((stat, i) => (
                                            <Card key={i} className="p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`p-2.5 rounded-xl bg-violet-600/10 text-violet-600`}>
                                                        <stat.icon className="h-5 w-5" />
                                                    </div>
                                                    <span className="text-xs font-black text-emerald-500">{stat.trend}</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                                                    <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>

                                    <Card className="p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                            <div className="max-w-md">
                                                <h3 className="text-2xl font-black tracking-tight mb-3">Boost Your Profile</h3>
                                                <p className="text-slate-500 font-medium mb-6">Complete your profile and add at least 6 reels to increase your chance of getting discovered by top brands.</p>
                                                <Button className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold h-12 px-8" onClick={() => setCurrentView('settings')}>
                                                    Update Profile
                                                </Button>
                                            </div>
                                            <div className="w-full md:w-64 aspect-square bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center p-8">
                                                <div className="text-center">
                                                    <div className="w-16 h-16 rounded-2xl bg-violet-600 text-white flex items-center justify-center mx-auto mb-4">
                                                        <Sparkles className="h-8 w-8" />
                                                    </div>
                                                    <p className="text-sm font-black uppercase tracking-widest text-slate-400">Profile Level</p>
                                                    <p className="text-xl font-black">{profile?.bio ? 'Gold' : 'Starter'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="p-6 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="text-xl font-black">Recent Reels</h4>
                                                <Button variant="ghost" className="text-violet-600 font-black" onClick={() => setCurrentView('reels')}>View All</Button>
                                            </div>
                                            <div className="space-y-4">
                                                {reels.slice(0, 3).map((reel) => (
                                                    <div key={reel.id} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                        <div className="w-12 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden">
                                                            {reel.thumbnail_url && <img src={reel.thumbnail_url} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-bold text-sm line-clamp-1">{reel.title}</p>
                                                            <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{reel.views?.toLocaleString()} Views</p>
                                                        </div>
                                                        <ExternalLink className="h-4 w-4 text-slate-300" />
                                                    </div>
                                                ))}
                                                {reels.length === 0 && (
                                                    <div className="text-center py-8">
                                                        <p className="text-sm font-bold text-slate-400 italic">No reels added yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>

                                        <Card className="p-6 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="text-xl font-black">New Inquiries</h4>
                                                <Button variant="ghost" className="text-violet-600 font-black" onClick={() => setCurrentView('inquiries')}>Manage</Button>
                                            </div>
                                            <div className="space-y-4">
                                                {inquiries.slice(0, 3).map((inq) => (
                                                    <div key={inq.id} className="p-4 rounded-2xl bg-violet-600/5 border border-violet-100 dark:border-violet-900/30">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="font-black text-sm">{inq.brand?.company_name}</p>
                                                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-black uppercase tracking-widest">New</Badge>
                                                        </div>
                                                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{inq.message}</p>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(inq.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                ))}
                                                {inquiries.length === 0 && (
                                                    <div className="text-center py-8">
                                                        <p className="text-sm font-bold text-slate-400 italic">No inquiries received yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                </motion.div>
                            )}

                            {currentView === 'reels' && (
                                <motion.div
                                    key="reels"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-black tracking-tight mb-2">My Showcase</h2>
                                            <p className="text-muted-foreground font-medium">Manage the reels that appear on your public media kit.</p>
                                        </div>
                                        <Button className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black h-12 px-6 shadow-xl shadow-violet-500/20 gap-2" onClick={() => setAddReelModal(true)}>
                                            <Plus className="h-4 w-4" />
                                            Add Reel
                                        </Button>
                                    </div>

                                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {reels.map((reel) => (
                                            <Card key={reel.id} className="group rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 transition-all hover:border-violet-500/50">
                                                <div className="aspect-[9/16] bg-slate-200 dark:bg-slate-800 relative">
                                                    {reel.thumbnail_url ? (
                                                        <img src={reel.thumbnail_url} alt={reel.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                                                            <Instagram className="h-10 w-10 text-violet-500/30" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Views</span>
                                                            <span className="text-lg font-black">{reel.views?.toLocaleString() || "0"}</span>
                                                        </div>
                                                        <Link href={reel.reel_url} target="_blank">
                                                            <Button size="icon" className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40">
                                                                <ExternalLink className="h-4 w-4 text-white" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-black text-sm mb-3 line-clamp-1">{reel.title || "Instagram Reel"}</h3>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{new Date(reel.created_at).toLocaleDateString()}</span>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 px-3 text-violet-600 font-bold text-[10px] uppercase tracking-widest"
                                                                onClick={() => {
                                                                    setEditingReel(reel);
                                                                    setEditReelModal(true);
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 px-3 text-red-500 font-bold text-[10px] uppercase tracking-widest"
                                                                onClick={() => handleDeleteReel(reel.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}

                                        <button
                                            onClick={() => setAddReelModal(true)}
                                            className="aspect-[9/16] rounded-[2rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 transition-all hover:border-violet-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 group"
                                        >
                                            <div className="h-16 w-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                                                <Plus className="h-8 w-8" strokeWidth={3} />
                                            </div>
                                            <span className="font-black text-slate-500 uppercase tracking-widest text-xs">Add New Reel</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {currentView === 'analytics' && (
                                <motion.div
                                    key="analytics"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tight mb-2">Internal Analytics</h2>
                                        <p className="text-muted-foreground font-medium">Performance insights based on your uploaded reels.</p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <Card className="p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                            <div className="flex flex-col gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
                                                    <TrendingUp className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total Views</p>
                                                    <h3 className="text-4xl font-black tracking-tighter">{stats.views}</h3>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                                    <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Real-time statistic</p>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                            <div className="flex flex-col gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                                                    <Users className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total Reach</p>
                                                    <h3 className="text-4xl font-black tracking-tighter">{stats.followers}</h3>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+4 new brand views</p>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                            <div className="flex flex-col gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                                    <Share2 className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Mean Engagement</p>
                                                    <h3 className="text-4xl font-black tracking-tighter">{stats.engagement}</h3>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Average: 2.1%</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="p-8 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-xl font-black tracking-tight">Performance Breakdown</h3>
                                                <Select defaultValue="7d">
                                                    <SelectTrigger className="w-[140px] rounded-xl border-2 font-bold focus:ring-violet-500">
                                                        <SelectValue placeholder="Timeframe" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="7d" className="font-bold">Last 7 Days</SelectItem>
                                                        <SelectItem value="30d" className="font-bold">Last 30 Days</SelectItem>
                                                        <SelectItem value="90d" className="font-bold">Last 90 Days</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-950 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                                                <div className="text-center">
                                                    <BarChart3 className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                                                    <p className="text-sm font-bold text-slate-400">Detailed line charts showing view growth and <br />engagement spikes will appear here.</p>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="p-8 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                                            <h3 className="text-xl font-black tracking-tight mb-8">Top Performing Reel</h3>
                                            {reels.length > 0 ? (
                                                (() => {
                                                    const topReel = [...reels].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
                                                    return (
                                                        <div className="space-y-6">
                                                            <div className="flex gap-6">
                                                                <div className="w-24 aspect-[9/16] rounded-2xl bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
                                                                    {topReel.thumbnail_url && <img src={topReel.thumbnail_url} className="w-full h-full object-cover" />}
                                                                </div>
                                                                <div className="flex-1 py-2">
                                                                    <Badge className="bg-violet-600 text-white border-none text-[10px] font-black uppercase mb-3">Best Performer</Badge>
                                                                    <h4 className="font-black text-lg line-clamp-2 leading-tight mb-2">{topReel.title}</h4>
                                                                    <p className="text-sm font-bold text-muted-foreground">{topReel.views?.toLocaleString()} Total Views</p>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Engagement</p>
                                                                    <p className="text-xl font-black">{((topReel.likes / (topReel.views || 1)) * 100).toFixed(1)}%</p>
                                                                </div>
                                                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Shares Rate</p>
                                                                    <p className="text-xl font-black">{((topReel.shares / (topReel.views || 1)) * 100).toFixed(2)}%</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()
                                            ) : (
                                                <div className="h-[300px] flex items-center justify-center text-slate-400 font-bold italic">
                                                    No reels added yet
                                                </div>
                                            )}
                                        </Card>
                                    </div>
                                </motion.div>
                            )}

                            {currentView === 'inquiries' && (
                                <motion.div
                                    key="inquiries"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tight mb-2">Brand Inquiries</h2>
                                        <p className="text-muted-foreground font-medium">Brands who visited your media kit and reached out.</p>
                                    </div>

                                    <div className="grid gap-6">
                                        {inquiries.map((inq) => (
                                            <Card key={inq.id} className="p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 overflow-hidden relative group">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                                                <div className="flex flex-col md:flex-row gap-8">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white text-xl font-black shadow-lg">
                                                                {inq.brand?.company_name?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-black tracking-tight">{inq.brand?.company_name}</h3>
                                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{inq.brand?.industry || 'Unknown Industry'}</p>
                                                            </div>
                                                            <Badge className="ml-auto bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 font-black text-[10px] uppercase">
                                                                {inq.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                                            "{inq.message}"
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                                                <Calendar className="h-3 w-3" />
                                                                Received on {new Date(inq.created_at).toLocaleDateString()}
                                                            </span>
                                                            <div className="flex gap-3">
                                                                {inq.status === 'accepted' ? (
                                                                    <Button
                                                                        className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black h-10 px-5 text-xs shadow-lg shadow-violet-500/20 gap-2"
                                                                        onClick={() => setActiveChat(inq)}
                                                                    >
                                                                        <MessageSquare className="h-3.5 w-3.5" />
                                                                        Open Chat
                                                                    </Button>
                                                                ) : inq.status === 'pending' ? (
                                                                    <>
                                                                        <Button
                                                                            variant="outline"
                                                                            className="rounded-xl font-black h-10 px-5 text-xs"
                                                                            onClick={() => handleUpdateInquiryStatus(inq.id, 'ignored')}
                                                                        >
                                                                            Ignore
                                                                        </Button>
                                                                        <Button
                                                                            className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black h-10 px-5 text-xs shadow-lg shadow-violet-500/20"
                                                                            onClick={() => handleUpdateInquiryStatus(inq.id, 'accepted')}
                                                                        >
                                                                            Accept & Reply
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <Badge className="bg-slate-100 text-slate-500 border-none px-3 py-1 font-black text-[10px] uppercase">
                                                                        {inq.status}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}

                                        {inquiries.length === 0 && (
                                            <div className="py-24 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                                <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                                <h3 className="text-xl font-black mb-2">No inquiries yet</h3>
                                                <p className="text-muted-foreground font-medium">Once a brand reaches out to you, it will appear here.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {currentView === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="max-w-2xl"
                                >
                                    <h2 className="text-3xl font-black tracking-tight mb-8">Profile Settings</h2>

                                    <Card className="p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 space-y-8">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Display Name</label>
                                                <Input
                                                    className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                                    value={settings.display_name}
                                                    onChange={(e) => setSettings({ ...settings, display_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                                                <Input className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500" value={profile?.username} disabled />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Location / City</label>
                                                <Input
                                                    className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                                    value={settings.city}
                                                    onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">WhatsApp</label>
                                                <Input
                                                    className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                                    value={settings.whatsapp}
                                                    placeholder="+91 XXXX XXXX"
                                                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Email</label>
                                                <Input
                                                    className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                                    value={settings.contact_email}
                                                    placeholder="hello@example.com"
                                                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Instagram Followers</label>
                                                <Input
                                                    type="number"
                                                    className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                                    value={settings.instagram_followers}
                                                    onChange={(e) => setSettings({ ...settings, instagram_followers: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Engagement Rate (%)</label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                                    value={settings.instagram_engagement_rate}
                                                    onChange={(e) => setSettings({ ...settings, instagram_engagement_rate: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Bio / About Me</label>
                                            <Textarea
                                                className="min-h-[150px] rounded-2xl border-2 font-medium p-4 focus:ring-violet-500"
                                                value={settings.bio}
                                                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                                            />
                                        </div>

                                        <div className="pt-4 flex justify-between items-center">
                                            <p className="text-xs font-bold text-muted-foreground italic">Last updated: {new Date(profile?.updated_at || profile?.created_at).toLocaleDateString()}</p>
                                            <Button
                                                className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black h-12 px-10 shadow-xl shadow-violet-500/20"
                                                onClick={handleUpdateProfile}
                                                disabled={updatingProfile}
                                            >
                                                {updatingProfile ? "Saving..." : "Save Changes"}
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <Sheet open={!!activeChat} onOpenChange={(open) => !open && setActiveChat(null)}>
                <SheetContent className="sm:max-w-md flex flex-col h-screen p-0 border-l-2">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black">
                                {activeChat?.brand?.company_name?.charAt(0)}
                            </div>
                            <div>
                                <p className="font-black leading-none">{activeChat?.brand?.company_name}</p>
                                <p className="text-xs font-bold text-muted-foreground mt-1">Chatting about your media kit</p>
                            </div>
                        </SheetTitle>
                    </SheetHeader>

                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4">
                            {chatMessages.map((msg) => {
                                const isMe = msg.sender_id === profile?.user_id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl font-medium text-sm ${isMe
                                            ? 'bg-violet-600 text-white rounded-tr-none shadow-lg shadow-violet-500/20'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                                            }`}>
                                            {msg.content}
                                            <p className={`text-[10px] mt-1.5 font-bold ${isMe ? 'text-violet-200' : 'text-slate-400'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                            {chatMessages.length === 0 && (
                                <div className="py-20 text-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="h-6 w-6 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 italic">No messages yet. <br />Say hi to {activeChat?.brand?.company_name}!</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-6 border-t bg-slate-50/50 dark:bg-slate-900/50">
                        <form onSubmit={handleSendMessage} className="flex gap-3">
                            <Input
                                placeholder="Type your message..."
                                className="h-12 rounded-xl border-2 font-medium focus:ring-violet-500"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={sendingMessage}
                            />
                            <Button
                                type="submit"
                                className="h-12 w-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 p-0"
                                disabled={sendingMessage || !newMessage.trim()}
                            >
                                <motion.div animate={sendingMessage ? { rotate: 360 } : {}}>
                                    {sendingMessage ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5 rotate-45" />}
                                </motion.div>
                            </Button>
                        </form>
                    </div>
                </SheetContent>
            </Sheet>

            <Dialog open={addReelModal} onOpenChange={setAddReelModal}>
                <DialogContent className="max-w-xl rounded-[2.5rem] border-2 p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tight">Add New Reel</DialogTitle>
                        <DialogDescription className="text-sm font-medium">
                            Paste the link to your Instagram reel and it will be showcased on your media kit.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Reel URL</Label>
                            <Input
                                className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                placeholder="https://www.instagram.com/reels/..."
                                value={newReel.url}
                                onChange={(e) => setNewReel({ ...newReel, url: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Title / Caption</Label>
                            <Input
                                className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                placeholder="e.g. Travel Vlog - Goa 🌴"
                                value={newReel.title}
                                onChange={(e) => setNewReel({ ...newReel, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Views</Label>
                                <Input
                                    type="number"
                                    className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                    placeholder="12000"
                                    value={newReel.views}
                                    onChange={(e) => setNewReel({ ...newReel, views: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Likes</Label>
                                <Input
                                    type="number"
                                    className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                    placeholder="450"
                                    value={newReel.likes}
                                    onChange={(e) => setNewReel({ ...newReel, likes: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Shares</Label>
                                <Input
                                    type="number"
                                    className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                    placeholder="120"
                                    value={newReel.shares}
                                    onChange={(e) => setNewReel({ ...newReel, shares: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-4">
                            <Button
                                variant="ghost"
                                className="rounded-xl font-bold h-12 px-6"
                                onClick={() => setAddReelModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black h-12 px-8 shadow-lg shadow-violet-500/20 gap-2"
                                onClick={handleAddReel}
                                disabled={addingReel || !newReel.url || !newReel.title}
                            >
                                {addingReel ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        Add to Media Kit
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={editReelModal} onOpenChange={setEditReelModal}>
                <DialogContent className="max-w-xl rounded-[2.5rem] border-2 p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tight">Edit Reel</DialogTitle>
                        <DialogDescription className="text-sm font-medium">
                            Update the performance metrics for your reel.
                        </DialogDescription>
                    </DialogHeader>

                    {editingReel && (
                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Title / Caption</Label>
                                <Input
                                    className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                    value={editingReel.title}
                                    onChange={(e) => setEditingReel({ ...editingReel, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Views</Label>
                                    <Input
                                        type="number"
                                        className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                        value={editingReel.views}
                                        onChange={(e) => setEditingReel({ ...editingReel, views: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Likes</Label>
                                    <Input
                                        type="number"
                                        className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                        value={editingReel.likes}
                                        onChange={(e) => setEditingReel({ ...editingReel, likes: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Shares</Label>
                                    <Input
                                        type="number"
                                        className="h-12 rounded-xl border-2 font-bold focus:ring-violet-500"
                                        value={editingReel.shares}
                                        onChange={(e) => setEditingReel({ ...editingReel, shares: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <Button
                                    variant="ghost"
                                    className="rounded-xl font-bold h-12 px-6"
                                    onClick={() => setEditReelModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black h-12 px-8 shadow-lg shadow-violet-500/20 gap-2"
                                    onClick={handleUpdateReel}
                                    disabled={addingReel || !editingReel.title}
                                >
                                    {addingReel ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
