"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel"
}: { 
  isOpen: boolean, 
  title: string, 
  message: string, 
  onConfirm: () => void, 
  onCancel: () => void,
  confirmText?: string,
  cancelText?: string
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
          <h3 className="text-lg font-bold text-zinc-100 mb-2">{title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="px-6 py-4 bg-zinc-950/50 flex justify-end gap-3 border-t border-zinc-800/50">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 text-sm font-semibold rounded-xl transition-all"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className="px-5 py-2 bg-red-600/90 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-red-900/20"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}