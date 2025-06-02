"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LiveDemoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInstallMessage, setShowInstallMessage] = useState(false);
  const [showPreviewMessage, setShowPreviewMessage] = useState(false);
  const [installStep, setInstallStep] = useState(0);
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
  
  const handleInstall = () => {
    setShowInstallMessage(true);
    setInstallStep(prev => (prev + 1) % 3);
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
      setShowInstallMessage(false);
    }, 3000);
  };
  
  const handleTestUI = () => {
    setShowPreviewMessage(true);
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
      setShowPreviewMessage(false);
    }, 3000);
  };

  return (
    <section id="demo" ref={sectionRef} className="py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              See the Tool in Action
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-3 sm:px-0">
              Watch how easily our tool extracts data from websites and
              transforms it into beautiful, customized templates in minutes.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-5xl mx-auto rounded-xl overflow-hidden border shadow-lg mx-3 sm:mx-4 md:mx-auto"
        >
          <div className="aspect-video relative overflow-hidden">
            {/* Video background */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-contain bg-black"
              src="/product_demo.mp4"
              poster="/thumbnail.png"
              muted
              playsInline
            ></video>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20"></div>
            
            {/* Interactive Demo Preview */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="flex flex-col items-center space-y-6">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer shadow-lg" onClick={togglePlayPause}>
                  {isPlaying ? (
                    <Pause className="h-8 w-8 text-white" />
                  ) : (
                    <Play className="h-8 w-8 text-white" />
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-white">Interactive Demo Preview</h3>
              </div>
              <p className="absolute bottom-4 sm:bottom-6 text-foreground bg-background/70 rounded-full py-1 text-xs sm:text-sm text-center px-3">
                {isPlaying ? "Click to pause" : "Click to see our full product walkthrough"}
              </p>
            </div>
          </div>

          {/* Interactive UI preview simulation */}
          <div className="bg-black/90 p-6 border-t border-gray-800">
            {/* Project Card */}
            <div className="mb-8 bg-gray-800/50 rounded-lg p-4 flex items-center">
              <div className="h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center mr-4">
                <span className="text-white font-medium">W</span>
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm font-medium">Wallidgardens</h4>
                <p className="text-gray-400 text-xs">wallidgardens</p>
              </div>
              <div className="flex space-x-2">
                <a 
                  href="/Wallofgardens.rar" 
                  download
                  className="bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-700 text-xs py-1 px-2 rounded flex items-center justify-center"
                >
                  Install
                  {showInstallMessage && (
                    <span className="absolute -top-10 left-0 right-0 bg-green-600 text-white text-xs py-1 px-2 rounded">
                      {installStep === 0 && "Template installed successfully!"}
                      {installStep === 1 && "Generating files..."}
                      {installStep === 2 && "Setup complete!"}
                    </span>
                  )}
                </a>
                <div className="relative group">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-700 text-xs"
                  >
                    <span className="inline-block w-4 h-4">⋯</span>
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20 hidden group-hover:block">
                    <a 
                      href="/wallofgardens/modern/index.html" 
                      download
                      className="block px-4 py-2 text-xs text-gray-300 hover:bg-gray-700"
                    >
                      Download Modern Template
                    </a>
                    <a 
                      href="/wallofgardens/elegant/index.html" 
                      download
                      className="block px-4 py-2 text-xs text-gray-300 hover:bg-gray-700"
                    >
                      Download Elegant Template
                    </a>
                    <a 
                      href="/wallofgardens/minimalist/index.html" 
                      download
                      className="block px-4 py-2 text-xs text-gray-300 hover:bg-gray-700"
                    >
                      Download Minimalist Template
                    </a>
                  </div>
                </div>
              </div>
            </div>
            

            
            {/* Template Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-6">
              <a 
                href="/wallofgardens/modern/index.html" 
                className="h-12 bg-gray-800/70 hover:bg-gray-700/70 rounded-md flex items-center justify-center text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-xs sm:text-sm font-medium">Modern Template</span>
              </a>
              <a 
                href="/wallofgardens/elegant/index.html" 
                className="h-12 bg-gray-800/70 hover:bg-gray-700/70 rounded-md flex items-center justify-center text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-xs sm:text-sm font-medium">Elegant Template</span>
              </a>
              <a 
                href="/wallofgardens/minimalist/index.html" 
                className="h-12 bg-gray-800/70 hover:bg-gray-700/70 rounded-md flex items-center justify-center text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-xs sm:text-sm font-medium">Minimalist Template</span>
              </a>
            </div>

            <div className="flex justify-center relative mb-6">
              <Button 
                className="bg-background text-foreground hover:bg-accent/80" 
                onClick={handleTestUI}
              >
                Test UI Preview
                {showPreviewMessage && (
                  <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-3 px-4 rounded-lg shadow-lg w-60">
                    <div className="relative">
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                      <p className="mb-1 font-semibold">Preview Generated!</p>
                      <p className="text-gray-300 text-xs">Your template is now ready for viewing</p>
                    </div>
                  </div>
                )}
              </Button>
            </div>
            
            {/* Feature Highlights Section */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 px-2 sm:px-4">
              <div className="bg-card/70 dark:bg-gray-800/70 p-2 sm:p-3 rounded-lg text-center shadow-sm border border-border/30">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-500 dark:text-blue-400 mb-1">100+</div>
                <div className="text-xs sm:text-sm text-muted-foreground dark:text-gray-300">Template Styles</div>
              </div>
              <div className="bg-card/70 dark:bg-gray-800/70 p-2 sm:p-3 rounded-lg text-center shadow-sm border border-border/30">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-500 dark:text-green-400 mb-1">90%</div>
                <div className="text-xs sm:text-sm text-muted-foreground dark:text-gray-300">Time Saved</div>
              </div>
              <div className="bg-card/70 dark:bg-gray-800/70 p-2 sm:p-3 rounded-lg text-center shadow-sm border border-border/30">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-500 dark:text-purple-400 mb-1">50K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground dark:text-gray-300">Data Points Extracted</div>
              </div>
              <div className="bg-card/70 dark:bg-gray-800/70 p-2 sm:p-3 rounded-lg text-center shadow-sm border border-border/30">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-amber-500 dark:text-amber-400 mb-1">15+</div>
                <div className="text-xs sm:text-sm text-muted-foreground dark:text-gray-300">Export Formats</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}