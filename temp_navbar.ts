"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Re-check auth status every time the URL path changes
  useEffect(() => {
    const token = localStorage.getItem("anime_auth_token");
    setIsAuthenticated(!!token); // Converts token existence to true/false
  }, [pathname]);

  // Scroll effect for dynamic floating design
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    // Destroy the VIP pass!
    localStorage.removeItem("anime_auth_token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <div className={`fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-500 ease-out ${isScrolled ? "pt-4" : "pt-8"}`}>
      <nav className={`
        flex items-center justify-between transition-all duration-500 ease-out overflow-hidden
        ${isScrolled 
          ? "w-[95%] sm:w-[85%] max-w-4xl h-16 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] px-6 sm:px-8" 
          : "w-[95%] sm:w-[85%] max-w-6xl h-20 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-lg px-8 sm:px-12"}
      `}>
        
        {/* The Logo / Brand */}
        <Link href="/" className="text-xl font-extrabold text-zinc-100 tracking-tight hover:text-indigo-400 transition-colors drop-shadow-md">
          Anime<span className="text-indigo-500">Notify.</span>
        </Link>

        {/* Dynamic Navigation Links */}
        <div className="flex items-center gap-5 sm:gap-7">
          <Link href="/dashboard" className="text-sm font-semibold text-zinc-400 hover:text-indigo-400 transition-colors">
            Dashboard
          </Link>

          {isAuthenticated ? (
            // WHAT LOGGED-IN USERS SEE
            <>
              <Link href="/subscriptions" className="text-sm font-semibold text-zinc-400 hover:text-indigo-400 transition-colors">
                My Subscriptions
              </Link>
              
              {/* 🚨 NEW: Added the Settings Link */}
              <Link href="/settings" className="text-zinc-400 hover:text-indigo-400 transition-colors group" title="Settings">
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </>
          ) : (
            // WHAT GUESTS SEE
            <>
              <Link href="/login" className="text-sm font-semibold text-zinc-400 hover:text-indigo-400 transition-colors">
                Login
              </Link>
              <Link href="/signup" className="text-sm font-bold bg-indigo-600/90 text-white px-4 py-2 rounded-xl hover:bg-indigo-500 hover:scale-105 transition-all shadow-md shadow-indigo-900/20">
                Sign Up
              </Link>
            </>
          )}
        </div>
        
      </nav>
    </div>
  );
}