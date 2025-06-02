"use client";

import { useState, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Move, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { smoothScrollTo } from "@/lib/utils";

export function HeroSection() {
  // State to track hotspot positions
  const [hotspots, setHotspots] = useState([
    { id: 1, x: 53, y: 89, color: "blue", title: "AI Data Extraction", description: "Automatically extract data from any website", delay: 0 },
    { id: 2, x: 62, y: 16, color: "green", title: "Template Generator", description: "Convert scraped data into beautiful, customized templates", delay: 100 },
    { id: 3, x: 2, y: 56, color: "purple", title: "One-Click Email Deploy", description: "Send Bulk emails to your customers", delay: 200 },
    { id: 4, x: 36, y: 75, color: "amber", title: "Customization Options", description: "Easily customize speed of data extraction", delay: 300 },
  ]);
  
  // State to track if edit mode is enabled
  const [editMode, setEditMode] = useState(false);
  
  // State to track which hotspot is being dragged
  const [draggingId, setDraggingId] = useState<number | null>(null);
  
  // Handle drag start
  const handleDragStart = (id: number) => {
    if (!editMode) return;
    setDraggingId(id);
  };
  
  // Handle drag movement
  const handleDrag = (e: MouseEvent<HTMLDivElement>, id: number) => {
    if (!editMode || draggingId !== id) return;
    
    // Get parent container dimensions
    const container = e.currentTarget.closest('.aspect-[16/9]') as HTMLElement;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    
    // Calculate position as percentage of container
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
    
    // Update hotspot position
    setHotspots(prev => prev.map(spot => 
      spot.id === id ? { ...spot, x, y } : spot
    ));
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setDraggingId(null);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  // Get color class based on color name
  const getColorClass = (color: string) => {
    const colors: Record<string, {bg: string, bgDark: string, text: string}> = {
      blue: {bg: "bg-blue-500/80", bgDark: "bg-blue-600", text: "text-blue-100"},
      green: {bg: "bg-green-500/80", bgDark: "bg-green-600", text: "text-green-100"},
      purple: {bg: "bg-purple-500/80", bgDark: "bg-purple-600", text: "text-purple-100"},
      amber: {bg: "bg-amber-500/80", bgDark: "bg-amber-600", text: "text-amber-100"}
    };
    return colors[color] || colors.blue;
  };
  
  return (
    <section className="relative pt-24 pb-16 md:pt-32 lg:pt-40 md:pb-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/5 via-secondary/10 to-background"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            className="flex flex-col items-center"
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Automate Website Creation from{" "}
              <motion.span 
                className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                Any Business URL
              </motion.span>
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 50 }}
          >
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-10 max-w-3xl mx-auto px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Scrape websites, extract data, and auto-generate ready-to-sell templates. 
              Save hours of work with our powerful AI-driven template generator.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, type: "spring", bounce: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4 sm:px-0"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                size="lg" 
                className="relative overflow-hidden group"
                onClick={() => smoothScrollTo('demo')}
              >
                <div className="flex items-center">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse", ease: "easeInOut" }}
                    className="absolute inset-0 bg-blue-500/20 translate-x-[-100%] group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                  />
                  Try Demo
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: "loop", ease: "easeInOut" }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </div>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 hover:border-primary/80 transition-colors duration-300"
                onClick={() => smoothScrollTo('pricing')}
              >
                Buy Now
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, type: "spring", stiffness: 50 }}
          className="mt-10 sm:mt-16 md:mt-24 relative max-w-5xl mx-auto px-2 sm:px-4"
          whileHover={{ scale: 1.01 }}
        >
          <motion.div 
            className="bg-card border rounded-lg shadow-lg overflow-hidden"
            initial={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="aspect-[16/9] relative overflow-hidden">
              {/* Thumbnail with interactive elements */}
              <div className="group relative w-full h-full">
                <Image 
                  src="/thumbnail.png" 
                  alt="WebKarigar Demo" 
                  fill 
                  className="object-contain" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                  priority
                />
                
                {/* Overlay with play button */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/30 transition-all duration-300">
                  <div className="text-center p-6 z-10">
                    <div 
                      className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                      onClick={() => smoothScrollTo('demo')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                        <path d="M8 5.14v14l11-7-11-7z" />
                      </svg>
                    </div>
                    <p className="text-base sm:text-lg font-medium text-white bg-black/40 py-1 px-3 rounded-full">Interactive Demo Preview</p>
                  </div>
                </div>
                
                {/* Edit mode toggle button */}
                {editMode ? (
                  <div className="absolute top-2 right-2 z-50">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={toggleEditMode}
                      className="bg-black/70 text-white hover:bg-black/60 flex items-center gap-1"
                    >
                      <Eye size={14} />
                      Exit Edit Mode
                    </Button>
                    <p className="text-xs text-white bg-black/50 p-1 mt-1 rounded text-center">
                      Drag hotspots to position them
                    </p>
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 z-50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleEditMode}
                      className="bg-black/50 text-white hover:bg-black/60 flex items-center gap-1"
                    >
                      <Move size={14} />
                      Move Hotspots
                    </Button>
                  </div>
                )}

                {/* Interactive hotspots - dynamically rendered from state */}
                {hotspots.map((hotspot) => {
                  const colorClasses = getColorClass(hotspot.color);
                  
                  // Determine tooltip position (left/right based on x position)
                  const tooltipPosition = hotspot.x > 50 ? 'right' : 'left';
                  
                  return (
                    <div 
                      key={hotspot.id}
                      className="absolute group/spot z-40"
                      style={{
                        top: `${hotspot.y}%`,
                        left: `${hotspot.x}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: editMode ? 'move' : 'pointer'
                      }}
                      onMouseDown={() => handleDragStart(hotspot.id)}
                      onMouseMove={(e) => handleDrag(e, hotspot.id)}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={handleDragEnd}
                    >
                      <div className="relative">
                        {/* Hotspot dot */}
                        <div 
                          className={`w-10 h-10 rounded-full ${colorClasses.bg} flex items-center justify-center ${editMode ? '' : 'animate-pulse'} hover:scale-125 transition-all duration-300 ease-in-out`}
                          style={{
                            animationDelay: `${hotspot.delay}ms`,
                            animationDuration: '2s',
                            boxShadow: draggingId === hotspot.id ? '0 0 10px 3px white' : '0 0 6px 2px rgba(255,255,255,0.3)',
                            transform: draggingId === hotspot.id ? 'scale(1.3)' : ''
                          }}
                        >
                          <div className={`w-5 h-5 rounded-full ${colorClasses.bgDark} transition-all duration-200 ease-in-out hover:scale-110`}></div>
                          
                          {/* Position coordinates (only shown in edit mode) */}
                          {editMode && (
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-[10px] text-white px-1 py-0.5 rounded whitespace-nowrap">
                              {Math.round(hotspot.x)}%, {Math.round(hotspot.y)}%
                            </div>
                          )}
                        </div>
                        
                        {/* Tooltip */}
                        <div 
                          className={`absolute ${tooltipPosition === 'left' ? 'left-full ml-3' : 'right-full mr-3'} top-1/2 -translate-y-1/2 ${colorClasses.bgDark} text-white text-xs py-2 px-3 rounded-md opacity-0 group-hover/spot:opacity-100 transition-opacity shadow-lg z-30 w-48 break-words`}
                        >
                          <p className="font-semibold mb-1">{hotspot.title}</p>
                          <p className={`${colorClasses.text} text-[10px] leading-tight`}>{hotspot.description}</p>
                        </div>
                      </div>
                    </div>
                  );
              })}
              </div>
            </div>
            {/* Action bar */}
            <div className="bg-card p-3 border-t flex justify-between items-center">
              <div className="text-xs text-muted-foreground">Hover over hotspots to learn more</div>
              <Link 
                href="#demo"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View Full Demo
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
          {/* Decorative elements */}
          <motion.div 
            className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          <motion.div 
            className="absolute -top-6 -left-6 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          ></motion.div>
        </motion.div>
        
        {/* Quick Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 50 }}
          className="mt-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-lg text-center shadow-sm"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-1"
                initial={{ backgroundPosition: "0% 0%" }}
                animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                >10,000+</motion.span>
              </motion.div>
              <div className="text-sm text-muted-foreground">Websites Generated</div>
            </motion.div>
            <motion.div 
              className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-lg text-center shadow-sm"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5, type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-1"
                initial={{ backgroundPosition: "0% 0%" }}
                animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
              >5 min</motion.div>
              <div className="text-sm text-muted-foreground">Average Setup Time</div>
            </motion.div>
            <motion.div 
              className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-lg text-center shadow-sm"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.5, type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-1"
                initial={{ backgroundPosition: "0% 0%" }}
                animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", delay: 1 }}
              >98%</motion.div>
              <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
            </motion.div>
            <motion.div 
              className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-lg text-center shadow-sm"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5, type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-1"
                initial={{ backgroundPosition: "0% 0%" }}
                animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", delay: 1.5 }}
              >24/7</motion.div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}