'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Pizza } from 'lucide-react';

interface PreloaderProps {
  fullScreen?: boolean;
  message?: string;
}

export function Preloader({ fullScreen = false, message = 'Assando suas informações...' }: PreloaderProps) {
  return (
    <div 
      className={`flex flex-col items-center justify-center bg-white/70 backdrop-blur-md ${
        fullScreen ? 'fixed inset-0 z-50' : 'w-full h-full min-h-[300px]'
      }`}
    >
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer glowing rings */}
        <motion.div
          className="absolute w-24 h-24 rounded-full border-t-2 border-red-500/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-32 h-32 rounded-full border-b-2 border-orange-400/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* The Pizza Icon */}
        <motion.div
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 8, -8, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative bg-gradient-to-tr from-orange-50 to-red-50 p-4 rounded-full shadow-[inset_0_2px_10px_rgba(239,68,68,0.1)] border border-red-100"
        >
          <Pizza className="w-10 h-10 text-red-600 drop-shadow-sm" strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Message and loading dots */}
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-slate-800 font-bold tracking-widest text-xs uppercase opacity-80">
          {message}
        </h3>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-red-500 rounded-full"
              animate={{ 
                scale: [1, 1.8, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
