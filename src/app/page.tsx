"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Map, Gauge, Sparkles, ShieldCheck, Layers, ChevronDown, Clock, AlertTriangle, Zap, Train, BarChart3, TrendingUp, Award } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShineButton } from "@/components/ui/ShineButton";

// Interactive animated background component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className="absolute w-[40rem] h-[40rem] rounded-full bg-brand-400/10 -top-20 -left-20 animate-blob"></div>
      <div className="absolute w-[35rem] h-[35rem] rounded-full bg-brand-500/10 top-40 right-0 animate-blob animation-delay-2000"></div>
      <div className="absolute w-[30rem] h-[30rem] rounded-full bg-brand-700/10 bottom-0 left-20 animate-blob animation-delay-4000"></div>
    </div>
  );
}

// Animated railway track component
function RailwayTrackAnimation() {
  const trackRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(0);
  
  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.offsetWidth);
    }
    
    const handleResize = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.offsetWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="relative w-full h-32 mt-8">
      <div ref={trackRef} className="max-w-3xl mx-auto relative h-full">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-brand-700"></div>
        <div className="absolute inset-x-0 bottom-2 h-4 flex justify-between">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i} 
              className="h-full w-4 bg-brand-600 mx-0.5 animate-track" 
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
        <motion.div 
          className="absolute bottom-6 h-8 w-20 bg-brand-700 rounded-t-lg"
          initial={{ x: 0 }}
          animate={{ 
            x: trackWidth > 0 ? [0, trackWidth - 80, 0] : [0, 0, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        >
          <div className="absolute -top-4 left-2 right-2 h-4 bg-brand-800 rounded-t-lg"></div>
        </motion.div>
      </div>
    </div>
  );
}

// Animated stat counter with target value
function AnimatedCounter({ value, label, icon: Icon, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000;
          const startTime = Date.now();
          
          const updateCounter = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            setCount(Math.floor(progress * value));
            
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          };
          
          requestAnimationFrame(updateCounter);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => observer.disconnect();
  }, [value]);
  
  return (
    <div ref={counterRef} className="glass p-6 flex flex-col items-center text-center">
      <Icon className="w-8 h-8 text-brand-700 mb-3" />
      <div className="text-4xl font-bold text-brand-700 mb-2">{prefix}{count}{suffix}</div>
      <div className="text-sm text-brand-800">{label}</div>
    </div>
  );
}

// Interactive feature card with hover effects
function InteractiveFeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(188, 108, 37, 0.3)" }}
      className="glass p-6 rounded-xl h-full flex flex-col"
    >
      <div className="flex items-start space-x-4">
        <div className="h-12 w-12 rounded-xl bg-brand-400/20 text-brand-700 flex items-center justify-center">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-brand-700 mb-2">{title}</h3>
          <p className="text-brand-800 text-base">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Interactive demo card component
function DemoCard({ title, subtitle, children, className = "" }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`glass rounded-2xl p-6 flex flex-col ${className} overflow-hidden`}
    >
      <div className="text-sm text-brand-700/70">{subtitle}</div>
      <div className="mt-2 text-2xl font-semibold text-brand-700">{title}</div>
      <div className="mt-6 flex-grow overflow-auto">
        {children}
      </div>
    </motion.div>
  );
}

// Railway statistics card
function StatCard({ title, value, change, icon: Icon }) {
  const isPositive = change > 0;
  
  return (
    <div className="glass p-4 rounded-xl flex items-center">
      <div className="h-12 w-12 rounded-xl bg-brand-400/20 text-brand-700 flex items-center justify-center mr-4">
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <div className="text-sm text-brand-800">{title}</div>
        <div className="text-xl font-bold text-brand-900">{value}</div>
      </div>
      <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{change}%
      </div>
    </div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  return (
    <div className="min-h-screen brand-gradient">
      <HeroSection opacity={opacity} />
      <FeaturesSection />
      <DemoSection />
      <ExpectedImpactSection />
      <RailwayStatsSection />
      <CTASection />
    </div>
  );
}

function HeroSection({ opacity }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl z-20"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-brand-700 shadow-sm">
          <Sparkles size={16} /> Live, interactive C2 platform
        </div>
        <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight text-brand-700 drop-shadow-sm">
          CHIMERA
        </h1>
        <p className="mt-6 text-lg md:text-2xl text-brand-700/80">
          Operational clarity for railway controllers. See conflicts early. Approve solutions fast.
        </p>
        
        <RailwayTrackAnimation />
        
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/app">
            <ShineButton>Launch Demo</ShineButton>
          </Link>
          <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-brand-700/30 bg-white/60 px-6 py-3 font-medium hover:bg-white/80 text-brand-700">
            Learn more
          </a>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce"
      >
        <a href="#features" className="flex flex-col items-center text-brand-700/70">
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown />
        </a>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { 
      icon: Map, 
      title: "Situational Awareness", 
      description: "Live map, Gantt, KPIs with instant updates. Always know the exact state of your railway network at a glance." 
    },
    { 
      icon: Gauge, 
      title: "Proactive Resolution", 
      description: "Conflict chips with Plan A/B and ripple preview. Resolve issues before they cascade across your network." 
    },
    { 
      icon: ShieldCheck, 
      title: "Safety First", 
      description: "Hard-rule checks on platforms, blocks, signals. Never compromise on safety with our built-in validation." 
    },
    { 
      icon: Layers, 
      title: "Scenario Sandbox", 
      description: "Run what-ifs and promote the winning plan. Test strategies without affecting live operations." 
    },
  ];

  return (
    <section id="features" className="py-20 surface section-shell">
      <div className="mx-auto max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-brand-700 mb-4">Intelligent Railway Management</h2>
          <p className="text-xl text-brand-800 max-w-3xl mx-auto">
            CHIMERA combines real-time data with predictive analytics to keep your railway operations running smoothly.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <InteractiveFeatureCard 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoSection() {
  // Sample conflict data
  const conflicts = [
    { id: "C-1023", severity: "High", type: "Headway Conflict", trains: ["IC-2847", "RE-1294"] },
    { id: "C-1024", severity: "Medium", type: "Platform Conflict", trains: ["RE-1294", "RB-5512"] },
    { id: "C-1025", severity: "Low", type: "Dwell Time", trains: ["IC-2847"] },
  ];

  // Sample KPI data
  const kpis = [
    { title: "On-time Performance", value: "94.7%", change: 1.3 },
    { title: "Average Delay", value: "3.2 min", change: -12.5 },
    { title: "Throughput", value: "42 trains/h", change: 6.8 },
    { title: "Conflict Resolution", value: "98.2%", change: 2.4 },
  ];

  return (
    <section className="py-20 surface-alt section-shell">
      <div className="mx-auto max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-brand-700 mb-4">See It In Action</h2>
          <p className="text-xl text-brand-800 max-w-3xl mx-auto">
            Experience how CHIMERA transforms complex railway operations into simple, actionable decisions.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <DemoCard 
            subtitle="Conflict Resolution" 
            title="Proactive Issue Management"
            className="h-[450px]"
          >
            <div className="space-y-4">
              {conflicts.map((conflict) => (
                <div key={conflict.id} className="surface p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        conflict.severity === "High" ? "bg-red-500" : 
                        conflict.severity === "Medium" ? "bg-amber-500" : "bg-green-500"
                      } mr-2`}></div>
                      <span className="text-sm font-semibold text-brand-800">{conflict.severity}</span>
                    </div>
                    <span className="text-xs text-brand-700">{conflict.id}</span>
                  </div>
                  <div className="font-bold text-brand-900 mb-1">{conflict.type}</div>
                  <div className="flex items-center space-x-2 text-xs text-brand-800 mb-3">
                    <Train className="w-3 h-3" />
                    <span>Trains: {conflict.trains.join(", ")}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="uv-action-button text-sm">Resolve with Plan A</button>
                    <button className="uv-action-button text-sm">Resolve with Plan B</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-brand-700">3 active conflicts detected</span>
            </div>
          </DemoCard>
          
          <DemoCard 
            subtitle="Real-time Dashboard" 
            title="Live Performance Metrics"
            className="h-[450px]"
          >
            <div className="space-y-4 mb-6">
              {kpis.map((kpi) => (
                <StatCard 
                  key={kpi.title}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  icon={
                    kpi.title.includes("On-time") ? Clock :
                    kpi.title.includes("Delay") ? AlertTriangle :
                    kpi.title.includes("Throughput") ? Gauge :
                    Zap
                  }
                />
              ))}
            </div>
            <div className="glass p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-brand-800">Network Status</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Operational</span>
              </div>
              <div className="h-24 relative">
                <div className="absolute inset-0 flex items-end">
                  {Array.from({ length: 24 }).map((_, i) => {
                    // Use a deterministic pattern instead of random values
                    const heights = [30, 45, 60, 40, 55, 35, 50, 65, 45, 55, 40, 60, 50, 35, 45, 55, 40, 50, 60, 45, 35, 55, 50, 40];
                    const height = heights[i % heights.length];
                    return (
                      <div 
                        key={i} 
                        className="flex-1 bg-brand-500/50 mx-0.5 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          </DemoCard>
        </div>
      </div>
    </section>
  );
}

function ExpectedImpactSection() {
  return (
    <section className="py-20 surface-strong section-shell">
      <div className="mx-auto max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-brand-700 mb-4">Expected Impact</h2>
          <p className="text-xl text-brand-800 max-w-3xl mx-auto">
            CHIMERA is designed to deliver significant improvements across your railway operations.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatedCounter value={98} label="Projected on-time percentage" icon={Clock} suffix="%" />
          <AnimatedCounter value={67} label="Conflicts resolved automatically" icon={Zap} suffix="%" />
          <AnimatedCounter value={42} label="Average delay reduction" icon={AlertTriangle} suffix="%" />
          <AnimatedCounter value={24} label="Hours saved per controller monthly" icon={Gauge} />
        </div>
      </div>
    </section>
  );
}

function RailwayStatsSection() {
  const railwayStats = [
    {
      category: "Delay Causes",
      stats: [
        { label: "Signal Failures", value: 32, icon: AlertTriangle },
        { label: "Track Maintenance", value: 27, icon: Gauge },
        { label: "Weather Conditions", value: 18, icon: Clock },
        { label: "Passenger Volume", value: 14, icon: Gauge },
        { label: "Other Factors", value: 9, icon: AlertTriangle },
      ]
    },
    {
      category: "Efficiency Metrics",
      stats: [
        { label: "Average Dwell Time", value: "2.3 min", trend: -8.4 },
        { label: "Turnaround Time", value: "18.7 min", trend: -12.6 },
        { label: "Platform Utilization", value: "87.3%", trend: 5.2 },
        { label: "Energy Efficiency", value: "92.1%", trend: 3.7 },
      ]
    },
    {
      category: "Performance Indicators",
      stats: [
        { label: "Service Reliability", value: "99.3%", trend: 1.2 },
        { label: "Customer Satisfaction", value: "91.8%", trend: 6.5 },
        { label: "Safety Rating", value: "97.5%", trend: 2.1 },
        { label: "Operational Costs", value: "-12.4%", trend: -12.4 },
      ]
    }
  ];

  return (
    <section className="py-20 surface section-shell">
      <div className="mx-auto max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-brand-700 mb-4">Railway Operations Insights</h2>
          <p className="text-xl text-brand-800 max-w-3xl mx-auto">
            Understanding the factors that impact railway performance and how CHIMERA addresses them.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {railwayStats.map((section) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-xl"
            >
              <h3 className="text-xl font-bold text-brand-700 mb-4">{section.category}</h3>
              
              {section.category === "Delay Causes" ? (
                <div className="space-y-4">
                  {section.stats.map((stat) => (
                    <div key={stat.label} className="flex items-center">
                      <div className="w-full bg-brand-200 rounded-full h-4 mr-2">
                        <div 
                          className="bg-brand-600 h-4 rounded-full" 
                          style={{ width: `${stat.value}%` }}
                        ></div>
                      </div>
                      <div className="min-w-[100px] text-right">
                        <div className="text-sm font-medium text-brand-800">{stat.label}</div>
                        <div className="text-xs text-brand-700">{stat.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {section.stats.map((stat) => (
                    <div key={stat.label} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-brand-800">{stat.label}</span>
                      <div className="flex items-center">
                        <span className="text-brand-900 font-bold">{stat.value}</span>
                        <span className={`ml-2 text-xs ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 surface-alt section-shell">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto px-6"
      >
        <h2 className="text-5xl font-bold text-brand-700 mb-6">Experience controller speed</h2>
        <p className="text-xl text-brand-700/80 mb-10">
          Make better decisions, faster—without leaving the keyboard. Join the railway operations revolution today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/app">
            <ShineButton>Launch Demo</ShineButton>
          </Link>
          <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-brand-700/30 bg-white/60 px-6 py-3 font-medium hover:bg-white/80 text-brand-700">
            Learn more <ArrowRight size={16} />
          </a>
    </div>
      </motion.div>
    </section>
  );
}

// Add these animations to globals.css
const cssAdditions = `
@keyframes blob {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50% { border-radius: 50% 60% 30% 60% / 40% 60% 70% 40%; }
  75% { border-radius: 40% 60% 70% 30% / 60% 40% 30% 70%; }
}

@keyframes track {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.8); }
}

.animate-blob {
  animation: blob 12s ease-in-out infinite;
}

.animate-track {
  animation: track 2s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
`;