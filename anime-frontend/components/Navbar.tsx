"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Re-check auth status every time the URL path changes
  useEffect(() => {
    const token = localStorage.getItem("anime_auth_token");
    setIsAuthenticated(!!token); // Converts token existence to true/false
  }, [pathname]);

  const handleLogout = () => {
    // Destroy the VIP pass!
    localStorage.removeItem("anime_auth_token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-10 h-16 flex items-center justify-between">
        
        {/* The Logo / Brand */}
        <Link href="/" className="text-xl font-extrabold text-gray-900 tracking-tight hover:text-blue-600 transition-colors">
          AnimeNotify<span className="text-blue-600">.</span>
        </Link>

        {/* Dynamic Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Dashboard
          </Link>

          {isAuthenticated ? (
            // WHAT LOGGED-IN USERS SEE
            <>
              <Link href="/subscriptions" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                My Subscriptions
              </Link>
              <button 
                onClick={handleLogout}
                className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            // WHAT GUESTS SEE
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link href="/signup" className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
        
      </div>
    </nav>
  );
}