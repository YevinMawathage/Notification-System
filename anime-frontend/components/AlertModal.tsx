"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function AlertModal({ 
  isOpen, 
  title, 
  message, 
  onClose, 
  type = "info" 
}: { 
  isOpen: boolean, 
  title: string, 
  message: string, 
  onClose: () => void, 
  type?: "info" | "error" | "success" | "warning"
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999] p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <h3 className={`text-lg font-bold mb-2 ${type === 'error' ? 'text-red-400' : type === 'success' ? 'text-emerald-400' : type === 'warning' ? 'text-yellow-400' : 'text-zinc-100'}`}>
            {title}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="px-6 py-4 bg-zinc-950/50 flex justify-end border-t border-zinc-800/50">
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-semibold rounded-xl transition-colors shadow-none hover:shadow-md"
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}