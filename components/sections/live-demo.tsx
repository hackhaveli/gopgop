"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Pause, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LiveDemoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInstallMessage, setShowInstallMessage] = useState(false);
  const [showPreviewMessage, setShowPreviewMessage] = useState(false);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTestUI = () => {
    setShowPreviewMessage(true);
    setTimeout(() => {
      setShowPreviewMessage(false);
    }, 3000);
  };

  return (
    <section id="demo" ref={sectionRef} className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
          >
            See GopGop in Action
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto"
          >
            Watch how fast it is to create a professional, proof-based media kit and get discovered by top brands.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          <div className="aspect-video relative overflow-hidden bg-slate-900">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              src="/product_demo.mp4"
              poster="/thumbnail.png"
              muted
              playsInline
              loop
            ></video>

            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlayPause}
                className="w-20 h-20 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl"
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </motion.button>
              <h3 className="text-xl font-bold text-white mt-6 tracking-tight">Full Product Walkthrough</h3>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
              {isPlaying ? "Video Playing" : "Paused • Click to play"}
            </div>
          </div>

          <div className="p-10 border-t border-slate-100 dark:border-slate-800">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h4 className="text-2xl font-black mb-4 tracking-tight">Live Creator Profile Preview</h4>
                <p className="text-muted-foreground font-medium mb-6">Experience how brands see your profile. Interactive reel embeds, verified followers count, and direct contact buttons.</p>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleTestUI} className="rounded-2xl h-14 px-8 font-black bg-violet-600 hover:bg-violet-700">
                    Try Live Preview
                  </Button>
                  <Button variant="outline" className="rounded-2xl h-14 px-8 font-black border-2 border-slate-200 dark:border-slate-800">
                    View Examples
                  </Button>
                </div>
                {showPreviewMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-sm font-bold"
                  >
                    ✨ Preview Generated! Open the preview window to see your kit.
                  </motion.div>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-violet-600">
                      <Download className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">Feature</p>
                      <p className="font-bold">One-Click PDF Export</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600">
                      <ExternalLink className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">Feature</p>
                      <p className="font-bold">Custom URL Sharing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}