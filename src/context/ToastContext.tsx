"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, Info, AlertCircle } from "lucide-react";

export type ToastType = "SUCCESS" | "INFO" | "ERROR" | "WARNING";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 w-full max-w-[320px] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-xl border-l-[6px] bg-white ${
              toast.type === "SUCCESS" ? "border-green-500" :
              toast.type === "ERROR" ? "border-red-500" :
              toast.type === "WARNING" ? "border-yellow-500" : "border-blue-500"
            }`}
          >
            <div className={`mt-0.5 ${
              toast.type === "SUCCESS" ? "text-green-500" :
              toast.type === "ERROR" ? "text-red-500" :
              toast.type === "WARNING" ? "text-yellow-500" : "text-blue-500"
            }`}>
              {toast.type === "SUCCESS" && <CheckCircle size={20} />}
              {toast.type === "ERROR" && <AlertCircle size={20} />}
              {toast.type === "INFO" && <Info size={20} />}
              {toast.type === "WARNING" && <AlertCircle size={20} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800 leading-tight">{toast.message}</p>
              <p className="text-[10px] text-gray-400 mt-1">Amazon - Harsh Store</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
