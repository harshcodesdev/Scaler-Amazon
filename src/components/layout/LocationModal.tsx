"use client";

import React, { useState } from "react";
import Image from "next/image";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
}

export default function LocationModal({ isOpen, onClose, onSelect }: LocationModalProps) {
  const [precise, setPrecise] = useState(false);
  const [pincode, setPincode] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[400px] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#F0F2F2] px-6 py-4 flex justify-between items-center border-b border-gray-300">
          <h2 className="font-bold text-lg">Choose your location</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-700">Select a delivery location to see product availability and delivery options.</p>

          {/* Simulated Map Container */}
          <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group cursor-crosshair">
            <Image 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=800&auto=format&fit=crop" 
              alt="Map" 
              fill 
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Pulsating Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce shadow-lg border-2 border-white">
                        <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded text-[10px] shadow-sm flex justify-between items-center">
                <span>{precise ? "PRECISE LOCATION ENABLED" : "APPROXIMATE LOCATION"}</span>
                <button 
                   onClick={() => setPrecise(!precise)}
                   className={`px-2 py-0.5 rounded transition-colors ${precise ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    {precise ? "On" : "Off"}
                </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="Enter pincode"
                    className="flex-1 px-3 py-2 border border-gray-400 rounded focus:ring-1 focus:ring-[#007185] outline-none text-sm shadow-inner"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                />
                <button 
                  onClick={() => pincode && onSelect(pincode)}
                  className="bg-white px-4 py-2 border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-sm font-medium"
                >
                    Apply
                </button>
            </div>

            <div className="relative">
                <div className="absolute inset-x-0 top-1/2 border-t border-gray-200" />
                <span className="relative z-10 bg-white px-2 mx-auto block w-fit text-xs text-gray-400">or</span>
            </div>

            <button 
                onClick={() => onSelect("Nagpur 440022")}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black py-2 rounded shadow-sm border border-[#FCD200] text-sm font-medium transition-colors"
            >
                Use current location
            </button>
          </div>
        </div>

        <div className="bg-[#F0F2F2] px-6 py-3 border-t border-gray-300 text-right">
          <button 
            onClick={onClose}
            className="text-[#007185] hover:text-[#C7511F] text-sm font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
