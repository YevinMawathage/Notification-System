"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AlertModal from "./AlertModal";

export default function SubscribeButton({ animeId, animeTitle }: { animeId: number, animeTitle: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, title: string, message: string, type: "info"|"error"|"success"|"warning"}>({
    isOpen: false, title: "", message: "", type: "info"
  });

  const handleSubscribe = async () => {
    // 1. Check if the user has a VIP pass (JWT Token)
    const token = localStorage.getItem("anime_auth_token");
    
    if (!token) {
      setAlertConfig({
        isOpen: true,
        title: "Login Required",
        message: "You must be logged in to subscribe to anime!",
        type: "error"
      });
      return; // Stop here, router push can happen after they see the alert or you could add it to onClose!
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
        if (res.status === 409) {
          throw new Error("You are already subscribed to this anime.");
        }
        let errorMsg = "Failed to subscribe";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
          errorMsg = await res.text() || errorMsg;
        }
        throw new Error(errorMsg);
      }

      setAlertConfig({
        isOpen: true,
        title: "Subscribed!",
        message: `Success! You will now receive alerts for ${animeTitle}.`,
        type: "success"
      });
      
    } catch (err: any) {
      const isAlreadySubscribed = err.message.includes("already subscribed");
      setAlertConfig({
        isOpen: true,
        title: isAlreadySubscribed ? "Already Subscribed" : "Action Failed",
        message: isAlreadySubscribed ? `You're already receiving alerts for ${animeTitle}.` : err.message,
        type: isAlreadySubscribed ? "warning" : "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
    // If it was the login error, kick them to login page after closing!
    if (alertConfig.title === "Login Required") {
      router.push("/login");
    }
  };

  return (
    <>
      <AlertModal 
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={handleAlertClose}
      />
      <button
        onClick={(e) => { e.stopPropagation(); handleSubscribe(); }}
        disabled={loading}
        className="w-full relative overflow-hidden bg-white/10 hover:bg-indigo-500 text-zinc-100 text-[11px] font-semibold py-1.5 px-3 rounded border border-white/20 hover:border-indigo-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md shadow-sm group/btn"
      >
      <span className="relative z-10 flex items-center justify-center gap-1.5">
        {loading ? (
          <>
            <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Wait...
          </>
        ) : (
          <>
            <svg className="w-3 h-3 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Subscribe
          </>
        )}
      </span>
    </button>
    </>
  );
}