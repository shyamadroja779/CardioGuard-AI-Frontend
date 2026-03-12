"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, HeartPulse, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-cyan-500/20 text-gray-400 py-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-4"
          >
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-2 bg-gradient-to-tr from-brand-600 to-cyan-500 rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-500/50"
              >
                <HeartPulse className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-bold text-lg text-white">Cardio<span className="text-cyan-400">Guard</span> AI</span>
            </Link>
            <p className="text-sm text-gray-500">
              Advanced AI-powered cardiovascular risk detection and health monitoring platform.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col space-y-4"
          >
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Product</h3>
            <div className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/predict", label: "Risk Assessment" },
                { href: "/dashboard", label: "Dashboard" },
              ].map(link => (
                <motion.div key={link.href} whileHover={{ x: 5 }}>
                  <Link href={link.href} className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col space-y-4"
          >
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Resources</h3>
            <div className="space-y-2">
              {[
                { label: "Documentation", href: "https://cardioguard-ai-api.onrender.com/docs" },
                { label: "Medical Terms", href: "#" },
                { label: "FAQ", href: "#" },
              ].map(link => (
                <motion.div key={link.label} whileHover={{ x: 5 }}>
                  <Link href={link.href} className="text-gray-400 hover:text-cyan-400 transition-colors">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col space-y-4"
          >
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Connect</h3>
            <p className="text-sm text-gray-500 mb-3">Built by <span className="text-cyan-400 font-semibold">Shyam Adroja</span></p>
            <div className="flex space-x-3">
              {[
                { icon: Github, href: "https://github.com/shyamadroja779", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Mail, href: "mailto:contact@example.com", label: "Email" },
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all"
                  title={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-8 origin-left"
        />

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center text-center md:text-left"
        >
          <p className="text-sm text-gray-500">
            © 2026 CardioGuard AI. All rights reserved By Shyam Adroja. For medical advice, consult healthcare professionals.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm">
            <motion.a
              href="#"
              className="text-gray-500 hover:text-cyan-400 transition-colors group relative"
              whileHover={{ scale: 1.05 }}
            >
              Terms of Service
              <motion.span
                className="absolute bottom-0 left-0 h-px bg-cyan-400 w-0 group-hover:w-full transition-all"
                layoutId="underline2"
              />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
