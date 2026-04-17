"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AlertModal from "@/components/AlertModal";
import ConfirmModal from "@/components/ConfirmModal";
import AnimeCard from "@/components/AnimeCard";

export default function SubscriptionsPage() {
  const router = useRouter();
  
  const [subscribedAnime, setSubscribedAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, title: string, message: string, type: "info" | "error" | "success"}>({
    isOpen: false, title: "", message: "", type: "info"
  });
  
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, animeId: number | null, animeTitle: string}>({
    isOpen: false, animeId: null, animeTitle: ""
  });

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = localStorage.getItem("anime_auth_token");
      
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/v1/users/subscribe/shows", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load your subscriptions.");
        }

        const data = await res.json();
        setSubscribedAnime(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [router]);

  // 🚨 NEW: The function to handle the Unsubscribe action
  const requestUnsubscribe = (animeId: number, animeTitle: string) => {
    setConfirmConfig({ isOpen: true, animeId, animeTitle });
  };

  const confirmUnsubscribe = async () => {
    const { animeId, animeTitle } = confirmConfig;
    if (!animeId) return;

    // Reset Confirm Modal
    setConfirmConfig({ isOpen: false, animeId: null, animeTitle: "" });
    const token = localStorage.getItem("anime_auth_token");

    try {
      // 2. Hit the DELETE endpoint you built in Go!
      const res = await fetch("http://localhost:4000/api/v1/users/unsubscribe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ anime_id: animeId }),
      });

      if (!res.ok) {
        throw new Error("Failed to unsubscribe");
      }

      // 3. React Magic: Instantly remove the anime from the screen!
      setSubscribedAnime((prevAnime) => prevAnime.filter((anime) => anime.anime_id !== animeId));
      
      setAlertConfig({
        isOpen: true,
        title: "Success",
        message: `Successfully unsubscribed from ${animeTitle}.`,
        type: "success"
      });
      
    } catch (err: any) {
      setAlertConfig({
        isOpen: true,
        title: "Error",
        message: err.message,
        type: "error"
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-semibold text-lg text-zinc-400">Loading your anime...</div>;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-8 pb-8 pt-36 sm:px-12 sm:pb-12 sm:pt-40 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto relative">
        
        {/* Modals placed outside main flow */}
        <ConfirmModal 
          isOpen={confirmConfig.isOpen}
          title="Unsubscribe?"
          message={`Are you sure you want to stop receiving alerts for "${confirmConfig.animeTitle}"?`}
          confirmText="Yes, Unsubscribe"
          cancelText="Cancel"
          onConfirm={confirmUnsubscribe}
          onCancel={() => setConfirmConfig({ isOpen: false, animeId: null, animeTitle: "" })}
        />
        
        <AlertModal 
          isOpen={alertConfig.isOpen}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        />
        
        <h1 className="text-3xl font-bold text-zinc-100 mb-8 tracking-tight">Your Subscriptions</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 backdrop-blur-sm shadow-inner text-sm font-medium">
            {error}
          </div>
        )}

        {subscribedAnime.length === 0 && !error ? (
          <div className="text-center bg-zinc-900/50 p-12 rounded-3xl border border-zinc-800/80 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-zinc-200 tracking-tight">No Subscriptions Yet</h3>
            <p className="text-zinc-500 mt-2 text-sm leading-relaxed">
              Head back to the dashboard and pick some shows to start getting notifications!
            </p>
            <Link href="/" className="inline-block mt-6 px-6 py-2.5 bg-indigo-600/90 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-900/20">
              Browse Anime
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full">
            {subscribedAnime.map((anime: any) => (
              <AnimeCard 
                key={anime.anime_id} 
                anime={anime}
                actionButton={
                  <button 
                    onClick={(e) => { e.stopPropagation(); requestUnsubscribe(anime.anime_id, anime.title); }}
                    className="w-full relative overflow-hidden bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white text-[11px] font-semibold py-1.5 px-3 rounded border border-red-500/20 hover:border-red-400 transition-all duration-300 backdrop-blur-md shadow-sm group/btn flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3 h-3 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Unsubscribe
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}