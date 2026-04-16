"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscribeButton({ animeId, animeTitle }: { animeId: number, animeTitle: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    // 1. Check if the user has a VIP pass (JWT Token)
    const token = localStorage.getItem("anime_auth_token");
    
    if (!token) {
      alert("You must be logged in to subscribe to anime!");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // 2. Send the secure POST request to your Go backend
      const res = await fetch("http://localhost:4000/api/v1/users/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 🚨 Injecting the VIP Pass!
        },
        body: JSON.stringify({ anime_id: animeId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to subscribe");
      }

      alert(`Success! You will now receive alerts for ${animeTitle}.`);
      
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-blue-300"
    >
      {loading ? "Subscribing..." : "Subscribe for Alerts"}
    </button>
  );
}