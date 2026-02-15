"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Preloader() {
    const [initialLoading, setInitialLoading] = useState(true);
    const [routeLoading, setRouteLoading] = useState(false);
    const pathname = usePathname();

    const loadingMessages = [
        "Summoning Influence...",
        "Curating Magic...",
        "Igniting Connections...",
        "Brewing Creator Gold...",
        "Calibrating Influence...",
        "Unlocking Potential...",
        "Crafting Excellence..."
    ];

    const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        // Initial site load
        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 1800);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Show brief loader on route change (menu switching)
        if (!initialLoading) {
            setRouteLoading(true);
            const randomMsg = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
            setCurrentMessage(randomMsg);

            const timer = setTimeout(() => {
                setRouteLoading(false);
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [pathname, initialLoading]);

    const showLoader = initialLoading || routeLoading;

    return (
        <AnimatePresence mode="wait">
            {showLoader && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-md"
                >
                    <div className="relative flex flex-col items-center text-center px-4">
                        {/* Animated Logo Container */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: [0.9, 1.05, 1],
                                opacity: 1
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: initialLoading ? Infinity : 0,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                            className="relative w-32 h-32 md:w-48 md:h-48 mb-6"
                        >
                            <Image
                                src="/logo.png"
                                alt="GopGop Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        {/* Progress Bar Container - only for initial load */}
                        {initialLoading && (
                            <div className="w-40 h-1 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.8, ease: "easeInOut" }}
                                    className="h-full bg-gradient-to-r from-violet-600 via-blue-600 to-pink-600"
                                />
                            </div>
                        )}

                        <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-sm font-black bg-gradient-to-r from-violet-600 via-blue-600 to-pink-600 bg-clip-text text-transparent tracking-[0.15em] uppercase"
                        >
                            {initialLoading ? "Aligning the Stars..." : currentMessage}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
