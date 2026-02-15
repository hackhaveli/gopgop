"use client";

import { use, useState, useEffect } from "react";
import { getYouTubeEmbedUrl, detectPlatform } from "@/lib/reel-utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Users,
    TrendingUp,
    Mail,
    MessageCircle,
    ExternalLink,
    Star,
    Instagram,
    Loader2,
    Video,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface CreatorProfile {
    id: string;
    display_name: string;
    username: string;
    bio?: string;
    niche?: string;
    city?: string;
    instagram_followers?: number;
    instagram_engagement_rate?: number;
    verification_status?: string;
    plan_type?: string;
    whatsapp?: string;
    contact_email?: string;
    instagram_handle?: string;
}

export default function CreatorMediaKit({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = use(params);
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [creator, setCreator] = useState<CreatorProfile | null>(null);
    const [reels, setReels] = useState<any[]>([]);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchCreatorData = async () => {
            try {
                setLoading(true);

                // 1. Fetch profile
                const { data: profile, error: profileError } = await supabase
                    .from('creator_profiles')
                    .select('*')
                    .eq('username', username)
                    .single();

                if (profileError || !profile) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }

                const typedProfile = profile as CreatorProfile;
                setCreator(typedProfile);

                // 2. Fetch reels
                const { data: reelsData, error: reelsError } = await supabase
                    .from('creator_reels')
                    .select('*')
                    .eq('creator_id', typedProfile.id)
                    .order('created_at', { ascending: false });

                if (!reelsError && reelsData) {
                    setReels(reelsData);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching creator:", err);
                setNotFound(true);
                setLoading(false);
            }
        };

        fetchCreatorData();
    }, [username, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
                <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] p-4 text-center">
                <div>
                    <h1 className="text-4xl font-black mb-4">404</h1>
                    <p className="text-xl text-muted-foreground mb-8">Creator profile not found.</p>
                    <Link href="/">
                        <Button className="bg-violet-600 hover:bg-violet-700 font-bold rounded-2xl">
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!creator) return null;

    const whatsappLink = creator.whatsapp ? `https://wa.me/${creator.whatsapp.replace(/\D/g, '')}` : null;
    const instagramHandle = creator.instagram_handle || creator.username;

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-violet-50/30 to-background dark:from-violet-950/10">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header Card */}
                <Card className="p-6 md:p-8 mb-6 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shrink-0">
                                {creator.display_name?.charAt(0) || creator.username?.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">{creator.display_name}</h1>
                                    {creator.verification_status === 'verified' && (
                                        <Badge className="bg-violet-600 border-none shadow-md">
                                            <Star className="h-3 w-3 mr-1 fill-white" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-lg font-bold text-muted-foreground mb-2">@{creator.username}</p>
                                <div className="flex flex-wrap gap-2">
                                    {creator.niche && <Badge variant="outline" className="rounded-full px-3 font-bold border-slate-200">{creator.niche}</Badge>}
                                    {creator.city && (
                                        <Badge variant="outline" className="rounded-full px-3 font-bold border-slate-200 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {creator.city}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Link
                            href={`https://instagram.com/${instagramHandle.replace('@', '')}`}
                            target="_blank"
                        >
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 active:scale-95 transition-all h-12 rounded-2xl font-black px-6">
                                <Instagram className="mr-2 h-5 w-5" />
                                Visit Instagram
                            </Button>
                        </Link>
                    </div>

                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-8 leading-relaxed max-w-3xl">
                        {creator.bio || "No bio description provided."}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-violet-600" />
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                                    Followers
                                </span>
                            </div>
                            <p className="text-3xl font-black tracking-tight">{creator.instagram_followers?.toLocaleString() || "N/A"}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                                    Engagement
                                </span>
                            </div>
                            <p className="text-3xl font-black tracking-tight text-emerald-600">
                                {creator.instagram_engagement_rate ? `${creator.instagram_engagement_rate}%` : "N/A"}
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="h-4 w-4 text-amber-600" />
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                                    Plan Type
                                </span>
                            </div>
                            <p className="text-3xl font-black tracking-tight capitalize text-amber-600">{creator.plan_type}</p>
                        </div>
                    </div>
                </Card>

                {/* Reels Grid */}
                <div className="mb-12">
                    <h2 className="text-3xl font-black tracking-tighter mb-8 flex items-center gap-3">
                        <Video className="h-8 w-8 text-violet-600" />
                        Featured Content
                    </h2>

                    {reels.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reels.map((reel) => {
                                const platform = detectPlatform(reel.reel_url);
                                const youtubeEmbedUrl = platform === 'youtube' ? getYouTubeEmbedUrl(reel.reel_url) : null;

                                return (
                                    <Card key={reel.id} className="group rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 transition-all hover:border-violet-500/50 hover:shadow-2xl">
                                        <div className="aspect-[9/16] bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                                            {/* YouTube Embed */}
                                            {youtubeEmbedUrl ? (
                                                <iframe
                                                    src={youtubeEmbedUrl}
                                                    className="w-full h-full absolute inset-0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    title={reel.title || "YouTube Video"}
                                                />
                                            ) : platform === 'instagram' ? (
                                                /* Instagram - Show preview with link to open */
                                                <>
                                                    {reel.thumbnail_url ? (
                                                        <img src={reel.thumbnail_url} alt={reel.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 flex items-center justify-center">
                                                            <Instagram className="h-16 w-16 text-purple-500/40" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                                    {/* Click overlay to open Instagram */}
                                                    <Link
                                                        href={reel.reel_url}
                                                        target="_blank"
                                                        className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
                                                    >
                                                        <div className="bg-white/90 hover:bg-white transition-all rounded-full p-6 group-hover/play:scale-110">
                                                            <Instagram className="h-12 w-12 text-purple-600" />
                                                        </div>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-center">
                                                            <p className="text-xs font-bold uppercase tracking-wider">Click to watch on Instagram</p>
                                                        </div>
                                                    </Link>
                                                </>
                                            ) : (
                                                /* Other platforms - show link */
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                                                        <Video className="h-16 w-16 text-violet-500/40" />
                                                    </div>
                                                    <Link
                                                        href={reel.reel_url}
                                                        target="_blank"
                                                        className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
                                                    >
                                                        <div className="bg-white/90 hover:bg-white transition-all rounded-full p-6 group-hover/play:scale-110">
                                                            <ExternalLink className="h-12 w-12 text-violet-600" />
                                                        </div>
                                                    </Link>
                                                </>
                                            )}

                                            {/* Stats Overlay (only for non-YouTube) */}
                                            {platform !== 'youtube' && (
                                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white pointer-events-none">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Views</span>
                                                            <span className="text-lg font-black">{reel.views?.toLocaleString() || "0"}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Likes</span>
                                                            <span className="text-lg font-black">{reel.likes?.toLocaleString() || "0"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-lg mb-2 line-clamp-1">{reel.title || "Video"}</h3>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                {platform === 'instagram' && <Instagram className="h-4 w-4" />}
                                                {platform === 'youtube' && <Video className="h-4 w-4" />}
                                                <span className="text-sm font-bold uppercase tracking-widest text-[10px]">
                                                    {platform === 'instagram' ? 'On Instagram' : platform === 'youtube' ? 'On YouTube' : 'External Link'}
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}

                        </div>
                    ) : (
                        <Card className="p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
                            <p className="text-xl font-bold text-muted-foreground">No reels showcased yet.</p>
                        </Card>
                    )}
                </div>

                {/* Contact CTA */}
                <Card className="p-10 md:p-16 bg-slate-950 text-white rounded-[3.5rem] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative text-center max-w-2xl mx-auto">
                        <Badge className="bg-violet-600 text-white mb-6 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px]">Collaboration Request</Badge>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                            Ready to build something <span className="text-violet-500 italic font-black">Epic?</span>
                        </h2>
                        <p className="text-lg text-slate-400 font-medium mb-10">
                            Professional inquiries only. Reach out via {whatsappLink ? "WhatsApp or " : ""}Email to discuss campaigns.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {whatsappLink && (
                                <Button size="lg" className="h-16 px-10 bg-[#25D366] hover:bg-[#20ba5a] text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all" asChild>
                                    <Link href={whatsappLink} target="_blank">
                                        <MessageCircle className="mr-3 h-6 w-6" />
                                        Message on WhatsApp
                                    </Link>
                                </Button>
                            )}
                            <Button size="lg" variant="outline" className="h-16 px-10 border-2 border-slate-800 hover:bg-slate-900 text-white font-black rounded-2xl hover:scale-105 transition-all" asChild>
                                <Link href={`mailto:${creator.contact_email || 'hello@gopgop.in'}`}>
                                    <Mail className="mr-3 h-6 w-6" />
                                    Send an Email
                                </Link>
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Footer Note */}
                <div className="mt-12 text-center">
                    <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">
                        Verified Media Kit by{" "}
                        <Link href="/" className="text-violet-600 hover:underline">
                            GopGop.in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
