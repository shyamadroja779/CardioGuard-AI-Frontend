"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Clock,
  HeartPulse,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20 overflow-hidden grid-bg">
      
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-0 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"
        />

        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
            x: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/50" />
      </div>

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-700/30 to-cyan-600/30 border border-cyan-500/50 backdrop-blur-md mb-8 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">
              Advanced AI-Powered Prediction
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight"
          >
            Predict Your{" "}
            <span className="text-gradient glow-text-accent">
              Heart Health
            </span>
            <br />
            with Precision
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-8"
          >
            CardioGuard AI leverages cutting-edge machine learning to analyze cardiovascular metrics
            and provide early detection of potential health risks with clinical accuracy.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/predict"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-cyan-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all border border-cyan-500/50"
              >
                <span>Get Risk Assessment</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gray-800 border border-cyan-500/30 rounded-lg font-bold text-cyan-400 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <span>View Analytics</span>
                <TrendingUp className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* STATS */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-lg text-center"
          >
            {[
              { label: "Accuracy", value: "97%" },
              { label: "Tests Run", value: "10K+" },
              { label: "Users", value: "500+" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-4 rounded-lg bg-brand-700/20 border border-cyan-500/30 backdrop-blur-md"
              >
                <p className="text-2xl md:text-3xl font-bold text-cyan-400">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Why Choose <span className="text-gradient">CardioGuard AI</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Advanced features for comprehensive cardiovascular health analysis
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Lightning Fast",
              description: "Get results in milliseconds with our optimized ML model",
            },
            {
              icon: <ShieldCheck className="w-8 h-8" />,
              title: "Highly Accurate",
              description: "97% accuracy rate developed with medical data",
            },
            {
              icon: <HeartPulse className="w-8 h-8" />,
              title: "Real-time Monitoring",
              description: "Continuous health metrics tracking and analysis",
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Patient Friendly",
              description: "Easy-to-use interface for all age groups",
            },
            {
              icon: <Clock className="w-8 h-8" />,
              title: "24/7 Available",
              description: "Access predictions anytime, anywhere",
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: "Data Insights",
              description: "Comprehensive analytics and health trends",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="card-industrial p-8"
            >
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-brand-600 to-cyan-600 flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-100">
                {feature.title}
              </h3>

              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 mt-24 py-12 bg-gray-950/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 CardioGuard AI. Advanced cardiovascular health monitoring powered by machine learning.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            For medical consultation, always consult healthcare professionals.
          </p>
        </div>
      </footer>
    </div>
  );
}