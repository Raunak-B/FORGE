"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function AuthDropdown({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const shouldReduceMotion = useReducedMotion();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  if (!user) {
    return (
      <Link 
        href="/login"
        className="hidden sm:inline-flex items-center justify-center rounded-md border-2 border-steel px-5 py-2.5 text-sm font-medium text-chalk transition-all duration-200 hover:bg-steel/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-iron motion-reduce:transition-none"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="primary" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        Profile
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-48 origin-top-right flex flex-col overflow-hidden rounded-md border border-steel/50 bg-iron shadow-2xl backdrop-blur-lg"
          >
            <Link 
              href="/workouts" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-sm font-medium text-chalk hover:bg-steel/20 transition-colors focus-visible:bg-steel/20 focus-visible:outline-none"
            >
              View profile
            </Link>
            
            <div className="h-[1px] w-full bg-steel/30" />
            
            <button 
              onClick={handleLogout} 
              className="w-full text-left px-4 py-3 text-sm font-bold text-plate hover:bg-steel/20 transition-colors focus-visible:bg-steel/20 focus-visible:outline-none"
            >
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}