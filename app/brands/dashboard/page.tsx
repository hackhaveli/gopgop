"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Bookmark, Mail, ExternalLink, MapPin, Users, TrendingUp, Loader2, Instagram, MessageSquare, Calendar, LayoutDashboard, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function BrandDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [creators, setCreators] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNiche, setSelectedNiche] = useState("all");
    const [selectedCity, setSelectedCity] = useState("all");
    const [savedCreators, setSavedCreators] = useState<string[]>([]);
    const [inquiryModal, setInquiryModal] = useState<{ open: boolean, creator: any | null }>({ open: false, creator: null });
    const [inquiryMessage, setInquiryMessage] = useState("");
    const [sendingInquiry, setSendingInquiry] = useState(false);
    const [pagination, setPagination] = useState({ total: 0, page: 1 });
    const [minFollowers, setMinFollowers] = useState("0");
    const [maxFollowers, setMaxFollowers] = useState("1000000");
    const [minEngagement, setMinEngagement] = useState("0");
    const [brandProfile, setBrandProfile] = useState<any | null>(null);
    const [currentView, setCurrentView] = useState('explore');
    const [inquiries, setInquiries] = useState<any[]>([]);

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

    const supabase = createClient();

    const fetchBrandData = async () => {
        try {
            const response = await fetch('/api/brands/me');
            const result = await response.json();
            if (result.success) {
                setBrandProfile(result.data);
                // Fetch shortlist
                const slResponse = await fetch(`/api/brands/${result.data.id}/shortlist`);
                const slResult = await slResponse.json();
                if (slResult.success) {
                    setSavedCreators(slResult.data.map((item: any) => item.creator_id));
                }

                // Fetch inquiries
                const inqResponse = await fetch(`/api/inquiries?brandId=${result.data.id}`);
                const inqResult = await inqResponse.json();
                if (inqResult.success) {
                    setInquiries(inqResult.data);
                }
            }
        } catch (error) {
            console.error("Error fetching brand profile:", error);
        }
    };

    const fetchCreators = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedNiche !== "all") params.append("niche", selectedNiche);
            if (selectedCity !== "all") params.append("city", selectedCity);
            if (minFollowers !== "0") params.append("min_followers", minFollowers);
            if (maxFollowers !== "1000000") params.append("max_followers", maxFollowers);
            if (minEngagement !== "0") params.append("min_engagement", minEngagement);
            params.append("verification_status", "verified"); // Default to verified for brands

            const response = await fetch(`/api/search/creators?${params.toString()}`);
            const result = await response.json();

            if (result.success) {
                setCreators(result.data.creators);
                setPagination(result.data.pagination);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching creators:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCreators();
        fetchBrandData();

        // Realtime inquiries listener
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
                    fetchBrandData(); // Refresh inquiries list
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedNiche, selectedCity, minFollowers, maxFollowers, minEngagement]);

    const filteredCreators = creators.filter(creator =>
        creator.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            .channel(`brand_messages:${activeChat.id}`)
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
                        // Avoid duplicates if message already exists (from optimistic update)
                        if (prev.some(m => m.id === payload.new.id)) return prev;

                        // Replace temp message if content matches and it's from the same sender
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
        if (!activeChat || !newMessage.trim() || !brandProfile) return;

        const content = newMessage.trim();
        setNewMessage("");

        // Optimistic update
        const optimisticMsg = {
            id: 'temp-' + Date.now(),
            inquiry_id: activeChat.id,
            sender_id: brandProfile.user_id,
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
                // Rollback on error
                setChatMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
                toast.error(result.message || "Failed to send message");
                setNewMessage(content); // Restore input
            }
        } catch (error) {
            setChatMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
            toast.error("An error occurred");
            setNewMessage(content);
        } finally {
            setSendingMessage(false);
        }
    };

    const toggleSave = async (creatorId: string) => {
        if (!brandProfile) return;

        const isSaved = savedCreators.includes(creatorId);

        try {
            if (isSaved) {
                // Remove from shortlist
                await fetch(`/api/brands/${brandProfile.id}/shortlist`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ creator_id: creatorId })
                });
                setSavedCreators(savedCreators.filter(id => id !== creatorId));
                toast.success("Removed from shortlist");
            } else {
                // Add to shortlist
                await fetch(`/api/brands/${brandProfile.id}/shortlist`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ creator_id: creatorId })
                });
                setSavedCreators([...savedCreators, creatorId]);
                toast.success("Added to shortlist");
            }
        } catch (error) {
            toast.error("Failed to update shortlist");
        }
    };

    const sendInquiry = async () => {
        if (!inquiryModal.creator || !inquiryMessage.trim()) return;

        try {
            setSendingInquiry(true);
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    creator_id: inquiryModal.creator.id,
                    message: inquiryMessage
                })
            });

            // Check for unauthorized (not logged in)
            if (response.status === 401) {
                toast.error("Please login as a brand to send inquiries");
                setInquiryModal({ open: false, creator: null });
                router.push('/auth/login');
                return;
            }

            const result = await response.json();
            if (result.success) {
                toast.success("Inquiry sent successfully!");
                setInquiryModal({ open: false, creator: null });
                setInquiryMessage("");
            } else {
                toast.error(result.message || "Failed to send inquiry");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setSendingInquiry(false);
        }
    };

    const openInquiryModal = (creator: any) => {
        const defaultPitch = `Hi ${creator.display_name}! I came across your amazing content on Instagram (@${creator.username}). I'd love to collaborate with you for a brand campaign. Let's discuss! 🚀`;
        setInquiryMessage(defaultPitch);
        setInquiryModal({ open: true, creator });
    };

    const copyPitch = (creator: any) => {
        const pitch = `Hi ${creator.display_name}! I came across your amazing content on Instagram (@${creator.username}). I'd love to collaborate with you for a brand campaign. Let's discuss! 🚀`;
        navigator.clipboard.writeText(pitch);
        toast.success("Pitch copied to clipboard!");
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

            <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/20 px-3 py-1 mb-4">
                            Brand Dashboard
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                            {currentView === 'explore' ? 'Discover ' : 'My '}<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{currentView === 'explore' ? 'Creators' : 'Inquiries'}</span>
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium">
                            {currentView === 'explore'
                                ? "Find and collaborate with India's most engaging micro-influencers."
                                : "Manage your conversations and collaborations with creators."}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        {brandProfile?.plan_type === 'trial' && brandProfile?.trial_ends_at && (
                            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-3 py-1 font-black uppercase flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {Math.max(0, Math.ceil((new Date(brandProfile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} Days Left in Trial
                            </Badge>
                        )}
                        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
                            <Button
                                variant={currentView === 'explore' ? "default" : "ghost"}
                                className={`rounded-xl font-bold h-11 px-6 ${currentView === 'explore' ? 'bg-blue-600 text-white shadow-lg' : ''}`}
                                onClick={() => setCurrentView('explore')}
                            >
                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                Explore
                            </Button>
                            <Button
                                variant={currentView === 'inquiries' ? "default" : "ghost"}
                                className={`rounded-xl font-bold h-11 px-6 ${currentView === 'inquiries' ? 'bg-blue-600 text-white shadow-lg' : ''}`}
                                onClick={() => setCurrentView('inquiries')}
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Inquiries
                            </Button>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {currentView === 'explore' ? (
                        <motion.div
                            key="explore"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="grid lg:grid-cols-4 gap-8"
                        >
                            {/* Left Sidebar - Filters */}
                            <div className="lg:col-span-1">
                                <Card className="p-6 sticky top-24 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-5 w-5 text-blue-600" />
                                            <h2 className="font-black text-lg tracking-tight">Search & Filter</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Search</label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Name or bio..."
                                                        className="pl-10 h-12 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border-none font-medium"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Niche</label>
                                                <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                                                    <SelectTrigger className="h-12 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border-none font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-2">
                                                        <SelectItem value="all">All Niches</SelectItem>
                                                        <SelectItem value="Fashion & Beauty">Fashion & Beauty</SelectItem>
                                                        <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                                                        <SelectItem value="Tech & Gadgets">Tech & Gadgets</SelectItem>
                                                        <SelectItem value="Travel">Travel</SelectItem>
                                                        <SelectItem value="Fitness & Health">Fitness & Health</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">City</label>
                                                <Select value={selectedCity} onValueChange={setSelectedCity}>
                                                    <SelectTrigger className="h-12 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border-none font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-2">
                                                        <SelectItem value="all">India (All)</SelectItem>
                                                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                                                        <SelectItem value="Delhi">Delhi</SelectItem>
                                                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                                                        <SelectItem value="Pune">Pune</SelectItem>
                                                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Min Followers</label>
                                                <Select value={minFollowers} onValueChange={setMinFollowers}>
                                                    <SelectTrigger className="h-12 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border-none font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-2">
                                                        <SelectItem value="0">Any</SelectItem>
                                                        <SelectItem value="1000">1K+</SelectItem>
                                                        <SelectItem value="5000">5K+</SelectItem>
                                                        <SelectItem value="10000">10K+</SelectItem>
                                                        <SelectItem value="50000">50K+</SelectItem>
                                                        <SelectItem value="100000">100K+</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Min Engagement</label>
                                                <Select value={minEngagement} onValueChange={setMinEngagement}>
                                                    <SelectTrigger className="h-12 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border-none font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-2">
                                                        <SelectItem value="0">Any</SelectItem>
                                                        <SelectItem value="1">1%+</SelectItem>
                                                        <SelectItem value="2">2%+</SelectItem>
                                                        <SelectItem value="5">5%+</SelectItem>
                                                        <SelectItem value="10">10%+</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Button
                                                className="w-full h-12 rounded-xl font-black border-2 bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                                                variant="outline"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setSelectedNiche("all");
                                                    setSelectedCity("all");
                                                    setMinFollowers("0");
                                                    setMaxFollowers("1000000");
                                                    setMinEngagement("0");
                                                }}
                                            >
                                                Reset All
                                            </Button>

                                            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                                                <Card className="p-4 bg-blue-600 text-white rounded-2xl border-none shadow-lg shadow-blue-500/20">
                                                    <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Pro Tip</p>
                                                    <p className="text-sm font-bold leading-relaxed">Verified creators have 3x higher engagement rates on average.</p>
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Right - Results */}
                            <div className="lg:col-span-3">
                                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                        {loading ? "Finding creators..." : `Found ${filteredCreators.length} Available Creators`}
                                    </p>
                                    <Link href="/brands/saved">
                                        <Button variant="outline" className="h-10 rounded-xl border-2 font-bold px-5">
                                            <Bookmark className="h-4 w-4 mr-2" />
                                            Saved Lists ({savedCreators.length})
                                        </Button>
                                    </Link>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-24">
                                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                                        <p className="font-bold text-slate-500 italic text-lg tracking-tight">Analyzing creator network...</p>
                                    </div>
                                ) : filteredCreators.length > 0 ? (
                                    <div className="grid gap-6">
                                        {filteredCreators.map((creator) => (
                                            <Card key={creator.id} className="p-0 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden hover:border-violet-500/50 transition-all group">
                                                <div className="flex flex-col md:flex-row">
                                                    {/* Creator Info Area */}
                                                    <div className="flex-1 p-8">
                                                        <div className="flex items-start justify-between mb-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                                                                    {creator.display_name?.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h3 className="text-2xl font-black tracking-tight">{creator.display_name}</h3>
                                                                        {creator.verification_status === 'verified' && (
                                                                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-2 py-0 text-[10px] font-black uppercase">
                                                                                ✓ Verified
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">@{creator.username}</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={`h-12 w-12 rounded-2xl border-2 ${savedCreators.includes(creator.id) ? "bg-blue-600 border-blue-600 text-white" : "border-slate-100 dark:border-slate-800"}`}
                                                                onClick={() => toggleSave(creator.id)}
                                                            >
                                                                <Bookmark className={`h-5 w-5 ${savedCreators.includes(creator.id) ? "fill-current" : ""}`} />
                                                            </Button>
                                                        </div>

                                                        <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 line-clamp-2">
                                                            {creator.bio || "No bio description provided."}
                                                        </p>

                                                        <div className="flex flex-wrap gap-2 mb-8">
                                                            <Badge variant="outline" className="rounded-full px-3 py-1 font-bold border-slate-200">{creator.niche}</Badge>
                                                            <Badge variant="outline" className="rounded-full px-3 py-1 font-bold border-slate-200 flex items-center gap-1.5">
                                                                <MapPin className="h-3 w-3 text-blue-600" />
                                                                {creator.city}
                                                            </Badge>
                                                            <Badge variant="outline" className="rounded-full px-3 py-1 font-bold border-slate-200 flex items-center gap-1.5">
                                                                <Users className="h-3 w-3 text-blue-600" />
                                                                {creator.instagram_followers?.toLocaleString() || "0"} followers
                                                            </Badge>
                                                            <Badge variant="outline" className="rounded-full px-3 py-1 font-bold border-slate-200 flex items-center gap-1.5">
                                                                <TrendingUp className="h-3 w-3 text-emerald-600" />
                                                                {creator.instagram_engagement_rate ? `${creator.instagram_engagement_rate}%` : "0%"} engagement
                                                            </Badge>
                                                        </div>

                                                        <div className="flex flex-wrap gap-3">
                                                            <Link href={`/c/${creator.username}`} className="flex-1 min-w-[160px]">
                                                                <Button className="w-full h-12 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black rounded-xl hover:scale-[1.02] transition-all gap-2">
                                                                    <ExternalLink className="h-4 w-4" />
                                                                    View Full Media Kit
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="outline"
                                                                className="h-12 px-6 rounded-xl border-2 font-black gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                                                onClick={() => openInquiryModal(creator)}
                                                            >
                                                                <Mail className="h-4 w-4" />
                                                                Send Inquiry
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Preview/Visual Area */}
                                                    <div className="md:w-[280px] bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center p-6 border-l-2 border-slate-100 dark:border-slate-800">
                                                        <div className="absolute top-4 right-4 text-slate-300 dark:text-slate-700">
                                                            <Instagram className="h-10 w-10 opacity-20" />
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-cyan-500/10 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 mb-4 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500">
                                                                <TrendingUp className="h-16 w-16 text-blue-600/20 group-hover:text-white transition-all duration-500" />
                                                            </div>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-blue-600 transition-colors">Performance Score</p>
                                                            <p className="text-2xl font-black text-slate-900 dark:text-white">
                                                                {((creator.instagram_followers || 0) / 10000 * 0.5 + (creator.instagram_engagement_rate || 0) * 10).toFixed(1)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
                                        <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold mb-2">No creators found</h3>
                                        <p className="text-muted-foreground font-medium mb-6">Try adjusting your filters or search keywords.</p>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl border-2 font-black"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setSelectedNiche("all");
                                                setSelectedCity("all");
                                                setMinFollowers("0");
                                                setMaxFollowers("1000000");
                                                setMinEngagement("0");
                                            }}
                                        >
                                            Clear All Filters
                                        </Button>
                                    </Card>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="inquiries"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid gap-6">
                                {inquiries.map((inq) => (
                                    <Card key={inq.id} className="p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 overflow-hidden relative group">
                                        <div className="flex flex-col md:flex-row gap-8">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xl font-black shadow-lg">
                                                        {inq.creator?.display_name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black tracking-tight">{inq.creator?.display_name}</h3>
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">@{inq.creator?.username}</p>
                                                    </div>
                                                    <Badge className={`ml-auto px-3 py-1 font-black text-[10px] uppercase border-none ${inq.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600' :
                                                        inq.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                                                            'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {inq.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                                    "{inq.message}"
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                                        <Calendar className="h-3 w-3" />
                                                        Sent on {new Date(inq.created_at).toLocaleDateString()}
                                                    </span>
                                                    <div className="flex gap-3">
                                                        {inq.status === 'accepted' && (
                                                            <Button
                                                                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black h-10 px-5 text-xs shadow-lg shadow-blue-500/20 gap-2"
                                                                onClick={() => setActiveChat(inq)}
                                                            >
                                                                <MessageSquare className="h-3.5 w-3.5" />
                                                                Open Chat
                                                            </Button>
                                                        )}
                                                        <Link href={`/c/${inq.creator?.username}`}>
                                                            <Button variant="outline" className="rounded-xl font-black h-10 px-5 text-xs">
                                                                View Kit
                                                            </Button>
                                                        </Link>
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
                                        <p className="text-muted-foreground font-medium">When you reach out to creators, your conversations will appear here.</p>
                                        <Button
                                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl"
                                            onClick={() => setCurrentView('explore')}
                                        >
                                            Explore Creators
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Sheet open={!!activeChat} onOpenChange={(open) => !open && setActiveChat(null)}>
                <SheetContent className="sm:max-w-md flex flex-col h-screen p-0 border-l-2">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
                                {activeChat?.creator?.display_name?.charAt(0)}
                            </div>
                            <div>
                                <p className="font-black leading-none">{activeChat?.creator?.display_name}</p>
                                <p className="text-xs font-bold text-muted-foreground mt-1">Chatting about your inquiry</p>
                            </div>
                        </SheetTitle>
                    </SheetHeader>

                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4">
                            {chatMessages.map((msg) => {
                                const isMe = msg.sender_id === brandProfile?.user_id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl font-medium text-sm ${isMe
                                            ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/20'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                                            }`}>
                                            {msg.content}
                                            <p className={`text-[10px] mt-1.5 font-bold ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
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
                                    <p className="text-sm font-bold text-slate-400 italic">No messages yet. <br />Wait for {activeChat?.creator?.display_name} to respond or send a follow up!</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-6 border-t bg-slate-50/50 dark:bg-slate-900/50">
                        <form onSubmit={handleSendMessage} className="flex gap-3">
                            <Input
                                placeholder="Type your message..."
                                className="h-12 rounded-xl border-2 font-medium focus:ring-blue-500"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={sendingMessage}
                            />
                            <Button
                                type="submit"
                                className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 p-0"
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

            <Dialog open={inquiryModal.open} onOpenChange={(open) => setInquiryModal({ ...inquiryModal, open })}>
                <DialogContent className="max-w-xl rounded-[2.5rem] border-2 p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tight">Send Inquiry to {inquiryModal.creator?.display_name}</DialogTitle>
                        <DialogDescription className="text-sm font-medium">
                            The creator will receive this message and can choose to contact you back.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Your Message / Pitch</label>
                            <Textarea
                                className="min-h-[200px] rounded-2xl border-2 font-medium p-4 focus:ring-blue-500"
                                placeholder="Describe your campaign and why you want to work together..."
                                value={inquiryMessage}
                                onChange={(e) => setInquiryMessage(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3 justify-end pt-4">
                            <Button
                                variant="ghost"
                                className="rounded-xl font-bold h-12 px-6"
                                onClick={() => setInquiryModal({ open: false, creator: null })}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black h-12 px-8 shadow-lg shadow-blue-500/20 gap-2"
                                onClick={sendInquiry}
                                disabled={sendingInquiry || !inquiryMessage.trim()}
                            >
                                {sendingInquiry ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="h-4 w-4" />
                                        Send Inquiry
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
