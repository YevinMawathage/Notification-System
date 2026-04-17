import Link from "next/link";
import AnimatedBackground from "../components/AnimatedBackground";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 font-sans selection:bg-indigo-500/30">
      
      {/* Background Animation */}
      <AnimatedBackground />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        
        <div className="inline-block mb-6 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
            Real-Time Notifications
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-500 tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
          Never Miss An <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Anime Episode.</span>
        </h1>
        
        <p className="text-zinc-400 text-lg sm:text-xl font-medium mb-10 max-w-2xl leading-relaxed">
          Track your favorite shows, configure instant custom alerts, and stay up to date with the latest broadcasts in real-time.
        </p>
        
        <Link 
          href="/dashboard" 
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-white bg-indigo-600 rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(79,70,229,0.4)]"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
          
          <span className="relative text-lg">Enter Dashboard</span>
          <svg className="w-5 h-5 relative transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
        
      </div>
      
    </main>
  );
}