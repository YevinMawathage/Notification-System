"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SlideToast, { ToastType } from "@/components/SlideToast";
import AlertModal from "@/components/AlertModal";

export default function SignupPage() {
  const router = useRouter();

  // Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "", type: "info", isVisible: false
  });
  const [alertInfo, setAlertInfo] = useState<{isOpen: boolean; title: string; message: string; type: "error"|"success"|"warning"|"info"}>({
    isOpen: false,
    title: "",
    message: "",
    type: "info"
  });

  // DB Images State
  const [dbImages, setDbImages] = useState<string[]>([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/anime?limit=15");
        if (res.ok) {
          const data = await res.json();
          // Extract valid image URLs from DB
          const validImages = data
            .map((item: any) => item.image_url)
            .filter((url: string) => url && url.startsWith("http"));
          
          if (validImages.length > 0) {
            setDbImages(validImages);
          } else {
            // Fallback placeholder if DB has no images yet 
            setDbImages(["https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000&auto=format&fit=crop"]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch DB images:", err);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (dbImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % dbImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [dbImages]);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast({ ...toast, isVisible: false });

    try {
      const res = await fetch("http://localhost:4000/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("This email or username is already registered. Please try logging in instead.");
        }
        let errorMessage = "Failed to sign up";
        try {
          const errorData = await res.json();
          if (errorData.error) errorMessage = errorData.error;
        } catch {
          // If JSON parse fails, it's plain text response from backend like "Username or Email already exists"
          // We already caught the 409 status above, but just in case catching fallback
          errorMessage = "This email or username already exists, or there was a system error.";
        }
        throw new Error(errorMessage);
      }

      showToast("Signup successful! Redirecting...", "success");
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      if (err instanceof Error) {
        setAlertInfo({ isOpen: true, title: "Signup Failed", message: err.message, type: "error" });
      } else {
        setAlertInfo({ isOpen: true, title: "Signup Failed", message: "An unknown error occurred", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans selection:bg-indigo-500/30">
      
      {/* Decorative dark background ray */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-zinc-950 to-zinc-950 -z-10"></div>
      
      <SlideToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <AlertModal
        isOpen={alertInfo.isOpen}
        title={alertInfo.title}
        message={alertInfo.message}
        type={alertInfo.type}
        onClose={() => setAlertInfo(prev => ({ ...prev, isOpen: false }))}
      />

      <div className="max-w-[1100px] w-full bg-zinc-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[700px]">
        
        {/* Working Back Button */}
        <Link 
          href="/"
          className="absolute top-8 left-8 w-12 h-12 bg-zinc-800/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-2xl z-30 hover:bg-indigo-600 hover:border-indigo-500 transition-all group"
          title="Go back to landing page"
        >
          <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </Link>

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">

          <div className="max-w-[360px] mx-auto w-full">
            {/* Logo area */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl transform -rotate-12 flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-zinc-950 rounded-md transform rotate-12"></div>
              </div>
            </div>

            <h2 className="text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-8 tracking-tight">      
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Username</label>
                <input
                  id="username"
                  type="text"
                  required
                  className="w-full px-4 py-3.5 bg-zinc-950/50 border border-white/5 rounded-xl text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-zinc-700 shadow-inner"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3.5 bg-zinc-950/50 border border-white/5 rounded-xl text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-zinc-700 shadow-inner"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full px-4 py-3.5 bg-zinc-950/50 border border-white/5 rounded-xl text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-zinc-700 shadow-inner"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-zinc-500">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline decoration-2 underline-offset-4">
                  Log in
                </Link>
              </p>
            </div>

            <p className="text-[10px] text-center text-zinc-600 mt-12">
              By creating an account, you agree to our Terms of use.
            </p>
          </div>
        </div>

        {/* Right Side: Image Showcase */}
        <div className="hidden md:block md:w-1/2 p-6 relative">
          
          <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
            {dbImages.map((img, index) => (
              <img
                key={`${img}-${index}`}
                src={img}
                alt="Anime Cover DB"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImgIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            
            {/* Overlay Gradient for Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10"></div>

            {/* Info Box */}
            <div className="absolute bottom-8 left-8 right-8 bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
              <p className="text-sm text-zinc-200 font-medium leading-relaxed">
                Join a community of thousands. Customize your alerts, track your favorite anime natively, and explore what's live.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">AN</span>
                </div>
                <div>
                  <p className="text-zinc-100 font-bold text-sm">Anime Notify</p>
                  <p className="text-indigo-400 text-xs">Premium Tracker</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
