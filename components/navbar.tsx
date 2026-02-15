"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import Image from "next/image";

import { cn, smoothScrollTo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const dashboardLink = user?.user_metadata?.role === 'brand' ? '/brands/dashboard' : '/creators/dashboard';

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
            src="/logo.png"
            alt="GopGop logo"
            width={300}
            height={120}
            className="h-14 md:h-20 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
          <div className="flex items-center gap-4 border-l pl-6 border-slate-200 dark:border-slate-800">
            <ThemeToggle />
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 border-2 border-violet-200 dark:border-violet-800 p-0 overflow-hidden shadow-sm hover:scale-105 transition-all">
                      <UserIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 rounded-2xl border-2 p-2 shadow-xl" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1 p-2">
                        <p className="text-sm font-black leading-none">{user.email?.split('@')[0]}</p>
                        <p className="text-xs leading-none text-muted-foreground font-bold">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer focus:bg-violet-50 dark:focus:bg-violet-900/20 focus:text-violet-600">
                      <Link href={dashboardLink} className="flex items-center gap-3 w-full font-bold">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer focus:bg-violet-50 dark:focus:bg-violet-900/20 focus:text-violet-600">
                      <Link href="/creators/onboarding" className="flex items-center gap-3 w-full font-bold">
                        <UserIcon className="h-4 w-4" />
                        Media Kit Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-xl p-3 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-600 text-red-500 font-bold flex items-center gap-3"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="font-bold hover:bg-violet-50 dark:hover:bg-violet-900/20">
                      Login
                    </Button>
                  </Link>
                  <Link href="/creators/onboarding">
                    <Button variant="default" size="sm" className="bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl px-5 shadow-lg shadow-violet-500/20">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )
            )}
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background border-b shadow-lg"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              <NavLinks mobile onClose={() => setIsOpen(false)} />
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {!loading && (
                  user ? (
                    <>
                      <Link href={dashboardLink} onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full h-12 rounded-xl font-bold gap-3 justify-start">
                          <LayoutDashboard className="h-5 w-5 text-violet-600" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full h-12 rounded-xl font-bold gap-3 justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" size="lg" className="w-full font-bold">
                          Login
                        </Button>
                      </Link>
                      <Link href="/creators/onboarding" onClick={() => setIsOpen(false)}>
                        <Button variant="default" size="lg" className="w-full bg-violet-600 text-white font-black rounded-xl">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header >
  );
}

function NavLinks({
  mobile = false,
  onClose,
}: {
  mobile?: boolean;
  onClose?: () => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const links = [
    { href: "/creators", label: "For Creators" },
    { href: "/brands", label: "For Brands" },
    { href: "#pricing", id: "pricing", label: "Pricing" },
    { href: "#faq", id: "faq", label: "FAQ" },
  ];

  return (
    <div
      className={cn(
        "flex items-center",
        mobile ? "flex-col space-y-2 w-full" : "gap-1"
      )}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {links.map((link, index) => {
        const isHovered = hoveredIndex === index;

        const content = (
          <span className="relative z-10">{link.label}</span>
        );

        const className = cn(
          "relative px-4 py-2 rounded-xl transition-colors duration-200 text-sm font-medium cursor-pointer flex items-center justify-center",
          isHovered ? "text-violet-600 dark:text-violet-400" : "text-foreground/80 hover:text-foreground",
          mobile && "w-full text-center text-lg py-3"
        );

        return (
          <div
            key={link.href}
            className={cn("relative", mobile && "w-full")}
            onMouseEnter={() => setHoveredIndex(index)}
          >
            {/* Sliding Liquid Background - Only visible when hovered */}
            {!mobile && isHovered && (
              <motion.div
                layoutId="nav-hover"
                className="absolute inset-0 bg-violet-500/10 dark:bg-violet-400/10 backdrop-blur-md rounded-xl border border-violet-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "spring",
                  bounce: 0.15,
                  stiffness: 130,
                  damping: 18,
                }}
              />
            )}

            {link.id ? (
              <a
                href={link.href}
                className={className}
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo(link.id!);
                  if (onClose) onClose();
                }}
              >
                {content}
              </a>
            ) : (
              <Link
                href={link.href}
                className={className}
                onClick={() => {
                  if (onClose) onClose();
                }}
              >
                {content}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
