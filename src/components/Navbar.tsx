"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/predict", label: "Risk Assessment" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass border-b border-accent-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-2 bg-gradient-to-tr from-brand-600 to-accent-500 rounded-lg group-hover:glow-accent transition-all duration-300"
            >
              <HeartPulse className="w-6 h-6 text-white animate-pulse" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-gray-100">
                Cardio<span className="text-accent-500">Guard</span>
              </span>
              <span className="text-xs text-accent-400 font-semibold">AI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link, idx) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                    pathname === link.href
                      ? "text-accent-400"
                      : "text-gray-300 hover:text-accent-300"
                  )}
                >
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-brand-700/30 rounded-lg border border-accent-500/50 -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-brand-700/50 rounded-lg transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-accent-400" />
            ) : (
              <Menu className="w-6 h-6 text-accent-400" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 space-y-2 border-t border-brand-600/50"
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-4 py-2 mt-2 rounded-lg transition-all",
                      pathname === link.href
                        ? "bg-brand-700/40 text-accent-400 border-l-2 border-accent-500"
                        : "text-gray-300 hover:bg-brand-700/20"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}