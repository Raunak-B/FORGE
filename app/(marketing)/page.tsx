"use client";

import { useEffect, useState } from "react";
// Add Variants to your import
import { motion, useReducedMotion, animate, Variants } from "framer-motion";
import Link from "next/link";
import Container from "@/components/ui/Container";

export default function MarketingPage() {
  const shouldReduceMotion = useReducedMotion();
  const [heroCount, setHeroCount] = useState(0);

  // Hero Counter Animation
  useEffect(() => {
    if (shouldReduceMotion) {
      setHeroCount(100);
      return;
    }
    
    const controls = animate(0, 100, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (value) => setHeroCount(Math.round(value)),
    });

    return controls.stop;
  }, [shouldReduceMotion]);

  // Motion variants that respect accessibility preferences
  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
      }
    }
  };

  const dramaticReveal: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 40 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="flex flex-col bg-iron text-chalk overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-screen flex-col items-center justify-center pt-16">
        <Container className="flex flex-col items-start justify-center z-10">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 mb-6">
            <motion.span 
              className="font-display text-8xl sm:text-9xl lg:text-[12rem] font-black tracking-tighter text-plate leading-none"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {heroCount}%
            </motion.span>
            <motion.h1 
              className="font-display text-6xl sm:text-7xl lg:text-9xl font-bold tracking-tight text-chalk leading-none uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: shouldReduceMotion ? 0 : 1.5, duration: 0.8 }}
            >
              Raw Effort.
            </motion.h1>
          </div>

          <motion.p 
            className="max-w-2xl text-lg sm:text-xl text-steel font-sans mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 2, duration: 0.8 }}
          >
            Leave the noise behind. Track your sets, hit your macros, and build a physique engineered by discipline, not algorithms.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 2.2, duration: 0.5 }}
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-plate px-8 py-4 text-lg font-bold text-chalk uppercase tracking-wide transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brass focus-visible:ring-offset-4 focus-visible:ring-offset-iron"
            >
              Start Training
            </Link>
          </motion.div>
        </Container>

        {/* Scroll Cue */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-steel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 3, duration: 1 }}
        >
          <span className="text-xs uppercase tracking-widest font-mono">Scroll</span>
          <div className="h-12 w-[2px] bg-steel/30 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/2 bg-steel"
              animate={shouldReduceMotion ? {} : { y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </motion.div>
      </section>

      {/* 2. STORY SECTION */}
      <section className="py-24 sm:py-32 lg:py-40 bg-iron">
        <Container>
          <motion.div 
            className="max-w-3xl mx-auto space-y-8 font-sans text-lg sm:text-xl text-chalk/90 leading-relaxed border-l-4 border-steel pl-6 sm:pl-10"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <p>
              Most fitness applications are built for the mirror. They optimize for endless scrolling, influencer aesthetics, and distractions that keep your eyes on the screen instead of the weight.
            </p>
            <p>
              We built Forge for the work. There are no gimmicks here. Just a cold, hard database waiting for your progress, your sets, and your sweat. If you aren't tracking, you are guessing—and we don't guess.
            </p>
            <p>
              You show up, you log the resistance, and you leave better than you arrived. The iron doesn't lie, and neither do your numbers.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* 3. PHILOSOPHY SECTION */}
      <section className="py-24 bg-iron/50 border-y border-steel/20">
        <Container>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              { title: "The Iron", desc: "Consistency over intensity. Show up exactly when you don't want to. That's where the adaptation happens." },
              { title: "The Data", desc: "Log every set, track every calorie. Emotion lies. The numbers in your logbook are absolute truth." },
              { title: "The Alliance", desc: "Surround yourself with a community that demands more from you. Compare progress, not egos." }
            ].map((panel, idx) => (
              <motion.div key={idx} variants={fadeUpVariant} className="flex flex-col gap-4">
                <div className="h-1 w-12 bg-brass mb-2" />
                <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide text-chalk">
                  {panel.title}
                </h3>
                <p className="font-sans text-steel text-base sm:text-lg">
                  {panel.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* 4. CONTEST / CHALLENGE SECTION */}
      <section className="py-32 sm:py-48 overflow-hidden relative">
        <Container>
          <motion.div 
            className="relative mx-auto max-w-4xl rounded-2xl border-4 border-plate bg-iron p-8 sm:p-16 shadow-[0_0_50px_rgba(200,54,43,0.15)]"
            variants={dramaticReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Background Texture/Detail */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-chalk via-iron to-iron" />
            
            <div className="relative z-10 flex flex-col items-center text-center gap-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-plate/20 text-plate font-mono text-sm sm:text-base font-bold uppercase tracking-widest border border-plate/30">
                Active Community Event
              </span>
              
              <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black text-chalk uppercase leading-none tracking-tight">
                The Forge 500
              </h2>
              
              <p className="font-sans text-lg sm:text-xl text-steel max-w-2xl mt-4">
                We are lifting <span className="text-chalk font-mono font-bold">500,000</span> total pounds as a community before August 1st. Add your volume to the global board.
              </p>

              {/* Scoreboard Mockup */}
              <div className="my-8 flex flex-col items-center gap-2 p-6 rounded-lg bg-[#0F1112] border border-steel/30 w-full max-w-md">
                <span className="text-steel font-sans text-sm uppercase tracking-widest">Current Global Volume</span>
                <span className="font-mono text-4xl sm:text-6xl font-bold text-brass tracking-wider drop-shadow-[0_0_10px_rgba(201,154,61,0.3)]">
                  342,890
                </span>
                <span className="text-steel font-sans text-xs uppercase">LBS Lifted</span>
              </div>

              <Link
                href="/signup"
                className="mt-4 inline-flex items-center justify-center rounded-md border-2 border-brass bg-transparent px-10 py-4 text-lg font-bold text-brass uppercase tracking-widest transition-all hover:bg-brass hover:text-iron focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plate focus-visible:ring-offset-4 focus-visible:ring-offset-iron"
              >
                Join the Challenge
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

    </div>
  );
}