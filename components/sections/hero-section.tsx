"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, TrendingUp, Star, Zap, Heart, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { useState, useEffect } from "react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();
  }, []);

  // Mouse move effect for background parallax and spotlight
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 30, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (event.clientX - left) / width;
    const y = (event.clientY - top) / height;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Parallax transformations for background blobs
  const blob1X = useTransform(springX, [0, 1], [30, -30]);
  const blob1Y = useTransform(springY, [0, 1], [30, -30]);
  const blob2X = useTransform(springX, [0, 1], [-40, 40]);
  const blob2Y = useTransform(springY, [0, 1], [-40, 40]);
  const blob3X = useTransform(springX, [0, 1], [35, -35]);
  const blob3Y = useTransform(springY, [0, 1], [-35, 35]);

  // Spotlight follows mouse
  const spotlightX = useTransform(springX, [0, 1], ["0%", "100%"]);
  const spotlightY = useTransform(springY, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative pt-24 pb-16 md:pt-32 lg:pt-40 md:pb-28 overflow-hidden group/hero"
    >
      {/* Optimized Background */}
      <div className="absolute inset-0 -z-10">
        {/* Static gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/40 to-blue-50/40 dark:from-slate-950 dark:via-violet-950/20 dark:to-blue-950/20" />

        {/* Interactive Spotlight Glow */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([x, y]) => `radial-gradient(1000px circle at ${x} ${y}, rgba(139, 92, 246, 0.12), transparent 45%)`
            )
          }}
        />

        {/* Animated gradient orbs with Parallax */}
        <motion.div
          style={{ x: blob1X, y: blob1Y }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-violet-400/10 dark:bg-violet-500/10 rounded-full blur-3xl animate-blob"
        />
        <motion.div
          style={{ x: blob2X, y: blob2Y }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"
        />
        <motion.div
          style={{ x: blob3X, y: blob3Y }}
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400/8 dark:bg-pink-500/8 rounded-full blur-3xl animate-blob animation-delay-4000"
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              India's Creator-Brand Marketplace
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6"
          >
            <span className="block italic">Find & Close</span>
            <span className="block bg-gradient-to-r from-violet-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Micro-Influencer Deals
            </span>
            <span className="block text-violet-600 dark:text-violet-400">Faster Than Ever</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto font-medium"
          >
            Discover Indian creators by{" "}
            <span className="font-bold text-violet-600 dark:text-violet-400 uppercase text-sm tracking-widest">niche</span>,{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400 uppercase text-sm tracking-widest">city</span> &{" "}
            <span className="font-bold text-pink-600 dark:text-pink-400 uppercase text-sm tracking-widest">views</span>.
            <br className="hidden sm:block" />
            See real reels. Shortlist. Contact instantly.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href={user ? '/creators/dashboard' : '/creators/get-started'}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="group bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 sm:px-10 py-6 sm:py-8 text-lg sm:text-xl font-black rounded-2xl transition-all w-full sm:w-auto"
                >
                  {user ? <LayoutDashboard className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> : <Users className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />}
                  {user ? 'Go to Dashboard' : 'Build Media Kit'}
                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/brands/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 sm:px-10 py-6 sm:py-8 text-lg sm:text-xl font-black border-2 border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all w-full sm:w-auto"
                >
                  <TrendingUp className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Find Creators
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              { value: "1000+", label: "Verified Creators", icon: Users, color: "text-violet-600" },
              { value: "50+", label: "Partner Brands", icon: Star, color: "text-blue-600" },
              { value: "₹99", label: "Starting Price", icon: Zap, color: "text-emerald-600" },
              { value: "98%", label: "Satisfaction", icon: Heart, color: "text-pink-600" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <div className="relative h-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 transition-all duration-300 hover:border-violet-500/50">
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                      className={cn("mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm", stat.color)}
                    >
                      <stat.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                    </motion.div>

                    <div className="text-2xl sm:text-4xl font-black tracking-tighter mb-1 sm:mb-2">
                      {stat.value}
                    </div>
                    <div className="text-[8px] sm:text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 20s infinite ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </section>
  );
}