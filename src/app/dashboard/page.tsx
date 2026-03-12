"use client";

import axios from "axios";
import { motion } from "framer-motion";
import {
  Activity,
  Heart,
  ShieldAlert,
  Target,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { LucideIcon } from "lucide-react";

/* ---------------- TYPES ---------------- */

type DashboardStats = {
  total_predictions: number;
  risk_distribution: Record<string, number>;
  model_accuracy: number;
  recent_predictions: number;
};

type StatCard = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  trend: string;
};

/* ---------------- CONSTANTS ---------------- */

const COLORS = ["#17faf4", "#ef4444", "#10b981", "#f59e0b"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const mockTrendData = [
  { month: "Jan", predictions: 400, risk: 240 },
  { month: "Feb", predictions: 600, risk: 330 },
  { month: "Mar", predictions: 800, risk: 420 },
  { month: "Apr", predictions: 700, risk: 380 },
  { month: "May", predictions: 900, risk: 500 },
  { month: "Jun", predictions: 1100, risk: 600 }
];

/* ---------------- COMPONENT ---------------- */

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get<DashboardStats>("/api/dashboard");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const pieData = stats
    ? Object.entries(stats.risk_distribution).map(([name, value]) => ({
      name,
      value
    }))
    : [];

  const statCards: StatCard[] = stats
    ? [
      {
        label: "Total Predictions",
        value: stats.total_predictions,
        icon: Users,
        color: "text-cyan-400",
        bgGradient: "from-cyan-600/20 to-cyan-500/10",
        trend: "+12%"
      },
      {
        label: "Recent Activity",
        value: stats.recent_predictions,
        icon: Activity,
        color: "text-brand-400",
        bgGradient: "from-brand-600/20 to-brand-500/10",
        trend: "+5%"
      },
      {
        label: "High Risk Alerts",
        value: stats.risk_distribution["High"] || 0,
        icon: Heart,
        color: "text-red-400",
        bgGradient: "from-red-600/20 to-red-500/10",
        trend: "-2%"
      },
      {
        label: "Model Accuracy",
        value: `${stats.model_accuracy.toFixed(1)}%`,
        icon: Target,
        color: "text-emerald-400",
        bgGradient: "from-emerald-600/20 to-emerald-500/10",
        trend: "Stable"
      }
    ]
    : [];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-900 text-gray-100">

      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black mb-2">
            Dashboard <span className="text-cyan-400">Board</span>
          </h1>

          <p className="text-gray-400">
            Real-time insights and prediction analytics
          </p>
        </motion.div>

        {/* LOADING */}

        {loading && (
          <div className="flex flex-col items-center justify-center h-64">

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-12 h-12 text-cyan-500" />
            </motion.div>

            <p className="mt-4 text-gray-400">Loading analytics...</p>

          </div>
        )}

        {!loading && !stats && (
          <div className="p-8 text-center border border-red-500 rounded-xl">
            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
            <p className="mt-4 text-gray-200 font-bold">Failed to Load Data</p>
          </div>
        )}

        {!loading && stats && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >

            {/* STAT CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {statCards.map((stat) => {
                const Icon = stat.icon;

                return (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className={`p-6 rounded-xl bg-gradient-to-br ${stat.bgGradient}`}
                  >

                    <div className="flex justify-between items-start">

                      <div>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className={stat.color}>{stat.trend}</p>
                      </div>

                      <Icon className={`w-8 h-8 ${stat.color}`} />

                    </div>

                  </motion.div>
                );
              })}

            </div>

            {/* CHARTS */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* PIE */}

              <div className="p-8 bg-gray-800 rounded-xl">

                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-cyan-400" />
                  Risk Distribution
                </h3>

                <div className="h-64">

                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>

                      <Pie
                        data={pieData}
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>

                      <Tooltip />

                    </PieChart>
                  </ResponsiveContainer>

                </div>

              </div>

              {/* AREA CHART */}

              <div className="lg:col-span-2 p-8 bg-gray-800 rounded-xl">

                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Prediction Trends
                </h3>

                <ResponsiveContainer width="100%" height={250}>

                  <AreaChart data={mockTrendData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="predictions"
                      stroke="#17faf4"
                      fill="#17faf4"
                      fillOpacity={0.2}
                    />

                    <Area
                      type="monotone"
                      dataKey="risk"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.2}
                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            </div>

          </motion.div>
        )}

      </div>

    </div>
  );
}