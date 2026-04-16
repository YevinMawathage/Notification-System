"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SubscriptionsPage() {
  const router = useRouter();
  
  const [subscribedAnime, setSubscribedAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  const handleUnsubscribe = async (animeId: number, animeTitle: string) => {
    // 1. Confirm with the user first (Good UX!)
    if (!confirm(`Are you sure you want to stop receiving alerts for ${animeTitle}?`)) return;

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
      
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Loading your anime...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {subscribedAnime.length === 0 && !error ? (
          <div className="text-center bg-white p-10 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-700">No Subscriptions Yet</h3>
            <p className="text-gray-500 mt-2">
              Go back to the dashboard and subscribe to some anime to receive notifications!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscribedAnime.map((anime: any) => (
              <div
                key={anime.anime_id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col border-l-4 border-l-blue-500"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-gray-800 truncate" title={anime.title}>
                    {anime.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3 font-medium">
                    {anime.title_japanese || "N/A"}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Alerts Active
                    </span>
                    
                    {/* 🚨 NEW: Connected the button to our function! */}
                    <button 
                      onClick={() => handleUnsubscribe(anime.anime_id, anime.title)}
                      className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                    >
                      Unsubscribe
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}