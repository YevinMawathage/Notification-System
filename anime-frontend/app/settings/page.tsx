"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ConfirmModal from "@/components/ConfirmModal";
import AlertModal from "@/components/AlertModal";

// Define what we expect the Go backend to send us
interface UserProfile {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export default function SettingsPage() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertInfo, setAlertInfo] = useState<{isOpen: boolean; title: string; message: string; type: "error"|"success"|"warning"|"info"}>({
    isOpen: false,
    title: "",
    message: "",
    type: "info"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("anime_auth_token");
      
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 🚨 We ask Go for the current user's data!
        const res = await fetch("http://localhost:4000/api/v1/users/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load profile data.");
        }

        const data = await res.json();
        setProfile(data);
        setEditUsername(data.username);
        setEditEmail(data.email);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("anime_auth_token");
    router.push("/login");
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("anime_auth_token");
    if (!token) return;

    setIsSaving(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/v1/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editUsername,
          email: editEmail,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update profile.");
      }

      // Re-fetch or update locally, here we update locally
      setProfile((prev) => prev ? { ...prev, username: editUsername, email: editEmail } : null);
      setIsEditing(false);
      setAlertInfo({
        isOpen: true,
        title: "Profile Updated",
        message: "Your profile information has been successfully updated.",
        type: "success"
      });
    } catch (err: any) {
      setAlertInfo({
        isOpen: true,
        title: "Update Failed",
        message: err.message,
        type: "error"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleteConfirmOpen(false);
    const token = localStorage.getItem("anime_auth_token");
    if (!token) return;

    setIsDeleting(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/v1/users/remove", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete account.");
      }

      // Clear token and go to signup or home
      localStorage.removeItem("anime_auth_token");
      router.push("/signup");
    } catch (err: any) {
      setAlertInfo({
        isOpen: true,
        title: "Account Deletion Failed",
        message: err.message,
        type: "error"
      });
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-semibold text-lg text-zinc-400 gap-4">
        <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading Settings...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 pb-12 pt-32 sm:px-12 sm:pt-40 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center sm:text-left"
        >
          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 tracking-tight">
            Account Settings
          </h1>
          <p className="mt-3 text-zinc-500 font-medium">Manage your profile, preferences, and account security.</p>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 backdrop-blur-md shadow-inner flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {profile && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/40 border border-white/5 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            
            {/* Profile Section */}
            <div className="p-8 sm:p-10 lg:p-12 relative overflow-hidden">
              {/* Subtle top glare */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between mb-10">
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shrink-0 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                    <div className="w-full h-full bg-zinc-900 rounded-xl flex items-center justify-center text-3xl font-black text-indigo-400">
                      {profile.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Your Profile</h2>
                    <p className="text-zinc-500 text-sm mt-1">Basic information associated with your account.</p>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <button 
                    onClick={handleLogout}
                    className="w-full sm:w-auto group relative overflow-hidden bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold py-2.5 px-6 rounded-xl border border-white/5 transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Username</label>
                  {isEditing ? (
                    <input 
                      type="text"
                      className="w-full bg-zinc-900 text-zinc-100 px-5 py-3.5 rounded-xl border border-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                    />
                  ) : (
                    <div className="w-full bg-zinc-950/50 text-zinc-200 px-5 py-3.5 rounded-xl border border-white/5 shadow-inner">
                      {profile.username}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                  {isEditing ? (
                    <input 
                      type="email"
                      className="w-full bg-zinc-900 text-zinc-100 px-5 py-3.5 rounded-xl border border-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  ) : (
                    <div className="w-full bg-zinc-950/50 text-zinc-200 px-5 py-3.5 rounded-xl border border-white/5 shadow-inner">
                      {profile.email}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Account Created</label>
                  <div className="inline-flex items-center gap-2 bg-zinc-950/50 px-4 py-2.5 rounded-lg border border-white/5 text-zinc-400 text-sm">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {new Date(profile.created_at).toLocaleDateString(undefined, { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2 flex justify-end mt-4">
                  {isEditing ? (
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setEditUsername(profile.username);
                          setEditEmail(profile.email);
                          setError("");
                        }}
                        className="px-6 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center min-w-[100px]"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 rounded-xl bg-zinc-800/50 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 font-semibold border border-indigo-500/20 transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Danger Zone Placeholder */}
            <div className="p-8 sm:p-10 lg:p-12 bg-red-950/10 border-t border-red-900/20 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="text-lg font-bold text-red-400 tracking-tight flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Danger Zone
                  </h2>
                  <p className="text-zinc-500 text-sm mt-2 max-w-md leading-relaxed">
                    Permanently delete your account and clear all anime subscriptions. This action is irreversible.
                  </p>
                </div>
                <button 
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="group relative whitespace-nowrap overflow-hidden bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white font-bold py-3 px-8 rounded-xl border border-red-500/20 hover:border-red-500 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </span>
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="Delete Account"
        message="Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose all tracking data."
        confirmText="Yes, delete my account"
        cancelText="Cancel"
        onConfirm={confirmDeleteAccount}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />

      <AlertModal
        isOpen={alertInfo.isOpen}
        title={alertInfo.title}
        message={alertInfo.message}
        type={alertInfo.type}
        onClose={() => setAlertInfo(prev => ({ ...prev, isOpen: false }))}
      />

    </main>
  );
}