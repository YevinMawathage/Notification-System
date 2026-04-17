"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SubscribeButton from "./SubscribeButton";

export default function AnimeCard({ anime, actionButton }: { anime: any, actionButton?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const embedUrl = anime.trailer_embed_url || anime.trailer?.embed_url || null;

  return (
    <>
      <div className="flex flex-col group cursor-pointer w-full" onClick={() => setIsOpen(true)}>
        {/* Cover Image & Hover Details */}
        <div className="relative overflow-hidden rounded-xl aspect-[2/3] w-full bg-zinc-900 border border-zinc-800/80 group-hover:border-zinc-700/80 transition-colors duration-500 shadow-md">
          <img
            src={anime.image_url || "https://via.placeholder.com/300x450?text=No+Image"}
            alt={`${anime.title} cover`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          {/* Hover Glass Overlay - Appears on Hover */}
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col p-3 z-10">
            
            {/* Score Badge */}
            <div className="flex justify-end mb-2">
              <div className="bg-zinc-900/90 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 flex items-center gap-1 shadow transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                <span className="text-yellow-400 text-[9px]">★</span>
                <span className="text-zinc-100 text-[10px] font-bold">{anime.score || "N/A"}</span>
              </div>
            </div>
            
            {/* Synopsis */}
            <div className="flex-grow overflow-hidden mb-2">
              <p className="text-zinc-300 text-[10px] sm:text-[11px] leading-relaxed line-clamp-[6] sm:line-clamp-[8] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                {anime.synopsis || "No synopsis available."}
              </p>
            </div>
            
            {/* Subscribe Button / Action Button */}
            <div 
              className="mt-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 ease-out scale-90 sm:scale-100 origin-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              {actionButton || <SubscribeButton animeId={anime.anime_id} animeTitle={anime.title} />}
            </div>
          </div>
        </div>
        
        {/* Always Visible Names (Below Image) */}
        <div className="pt-2 px-0.5 relative z-0">
          <h2 className="text-xs sm:text-sm font-bold text-zinc-100 line-clamp-1 group-hover:text-indigo-400 transition-colors duration-300" title={anime.title}>
            {anime.title}
          </h2>
          <p className="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5 line-clamp-1 font-medium uppercase tracking-wide">
            {anime.title_japanese || "\u00A0"}
          </p>
        </div>
      </div>

      {/* Expanded Details Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-6xl max-h-[90vh] bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Close button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Left Column - Image & Actions (More Compact) */}
              <div className="w-full md:w-[30%] lg:w-[25%] relative shrink-0 flex flex-col md:border-r border-white/5 bg-black/40">
                {/* Background blurred image for ambient color */}
                <div className="absolute inset-0 z-0 opacity-30 overflow-hidden pointer-events-none">
                  <img 
                    src={anime.image_url || "https://via.placeholder.com/300x450?text=No+Image"} 
                    alt="" 
                    className="w-full h-full object-cover blur-[60px] scale-150 transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-zinc-950"></div>
                </div>

                <div className="relative z-10 p-5 md:p-6 flex flex-col items-center h-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-3/4 max-w-[200px] md:w-full group relative rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] overflow-hidden ring-1 ring-white/10 mb-6"
                  >
                    <img
                      src={anime.image_url || "https://via.placeholder.com/300x450?text=No+Image"}
                      alt={anime.title}
                      className="w-full h-auto object-cover aspect-[2/3]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 mix-blend-overlay"></div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full flex flex-col gap-3 mt-auto"
                  >
                    <div className="w-full [&>button]:w-full">
                      {actionButton || <SubscribeButton animeId={anime.anime_id} animeTitle={anime.title} />}
                    </div>
                    
                    <div className="flex items-center justify-between bg-zinc-900/60 backdrop-blur-md px-4 py-3 rounded-xl border border-white/5 shadow-inner">
                      <span className="text-zinc-400 text-xs font-bold tracking-widest uppercase">Score</span>
                      <div className="flex items-center gap-1 bg-zinc-950/50 px-2 py-1 rounded-lg border border-white/5">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="font-bold text-sm text-zinc-100">{anime.score || "N/A"}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Column - Details & Video */}
              <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
                  
                  {/* Title & Subtitle */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 pr-12 leading-tight drop-shadow-sm">
                      {anime.title}
                    </h2>
                    <p className="text-indigo-400/80 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                      {anime.title_japanese}
                    </p>
                  </motion.div>

                  {/* Trailer - Moved to top above synopsis */}
                  {embedUrl && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="w-full relative rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                    >
                      <div className="absolute inset-0 bg-zinc-900 animate-pulse -z-10"></div>
                      <div className="relative w-full aspect-video z-10">
                        <iframe
                          src={embedUrl}
                          title={`${anime.title} Trailer`}
                          className="absolute inset-0 w-full h-full transition-opacity duration-500"
                          allowFullScreen
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                      </div>
                    </motion.div>
                  )}

                  {/* Synopsis */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-px bg-gradient-to-r from-indigo-500 to-transparent w-8 opacity-60"></div>
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Synopsis</h3>
                      <div className="h-px bg-gradient-to-l from-indigo-500 to-transparent flex-1 opacity-60"></div>
                    </div>
                    
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-inner">
                      <p className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                        {anime.synopsis || "No synopsis available."}
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Bottom spacer to prevent content from hitting the bottom edge while scrolling */}
                  <div className="h-4 md:h-8"></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}