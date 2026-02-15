"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="relative pt-16 pb-8 overflow-hidden">
      {/* Concentric circles pattern background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-purple-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-purple-950/10 dark:to-indigo-950/10">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
          backgroundImage: `
            radial-gradient(circle, currentColor 1.5px, transparent 1.5px),
            radial-gradient(circle, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 30px 30px',
          backgroundPosition: '0 0, 15px 15px'
        }} />
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/60 to-transparent" />
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="GopGop logo"
                  width={350}
                  height={140}
                  className="h-28 w-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              India's micro-influencer marketplace. Connect creators with brands. Build professional media kits. Close deals faster.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Twitter, href: "https://twitter.com/gopgop", color: "hover:text-blue-400", label: "Twitter" },
                { icon: Instagram, href: "https://instagram.com/gopgop", color: "hover:text-pink-500", label: "Instagram" },
                { icon: Linkedin, href: "https://linkedin.com/company/gopgop", color: "hover:text-blue-600", label: "LinkedIn" },
                { icon: Mail, href: "mailto:hello@gopgop.in", color: "hover:text-violet-500", label: "Email" },
              ].map((item, i) => (
                <Link key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined}>
                  <motion.div
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-colors duration-200",
                      item.color
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">For Creators</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/creators" className="text-muted-foreground hover:text-foreground transition-colors">
                  Build Media Kit
                </Link>
              </li>
              <li>
                <Link href="/creators/get-started" className="text-muted-foreground hover:text-foreground transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/creators/examples" className="text-muted-foreground hover:text-foreground transition-colors">
                  Examples
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">For Brands</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/brands" className="text-muted-foreground hover:text-foreground transition-colors">
                  Find Creators
                </Link>
              </li>
              <li>
                <Link href="/brands/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/brands/signup" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <h4 className="font-semibold mb-3">Legal & Support</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Important:</strong> GopGop is NOT affiliated with Instagram/Meta.
            </p>
            <p className="text-sm text-muted-foreground">
              All content is user-submitted. We don't scrape data.
            </p>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} GopGop. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}