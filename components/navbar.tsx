"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import { cn, smoothScrollTo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 md:py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/webkarigar.png" 
            alt="WebKarigar Logo" 
            width={36} 
            height={36} 
            className="h-8 sm:h-10 w-auto block dark:hidden" 
          />
          <Image 
            src="/webkarigar-white.png" 
            alt="WebKarigar Logo" 
            width={36} 
            height={36} 
            className="h-8 sm:h-10 w-auto hidden dark:block" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="default" 
              size="sm"
              onClick={() => smoothScrollTo('pricing')}
            >
              Buy Now
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-background border-b shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLinks mobile onClose={() => setIsOpen(false)} />
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                smoothScrollTo('pricing');
                setIsOpen(false);
              }}
            >
              Buy Now
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
}

function NavLinks({
  mobile = false,
  onClose,
}: {
  mobile?: boolean;
  onClose?: () => void;
}) {
  const links = [
    { href: "#features", id: "features", label: "Features" },
    { href: "#how-it-works", id: "how-it-works", label: "How It Works" },
    { href: "#demo", id: "demo", label: "Demo" },
    { href: "#faq", id: "faq", label: "FAQ" },
  ];

  return (
    <>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={cn(
            "text-foreground/80 hover:text-foreground transition-colors cursor-pointer",
            mobile && "py-2 text-lg font-medium"
          )}
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo(link.id);
            if (onClose) onClose();
          }}
        >
          {link.label}
        </a>
      ))}
    </>
  );
}