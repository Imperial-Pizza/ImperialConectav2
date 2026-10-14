'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface StatusBannerProps {
  message: string | null;
  variant?: 'success' | 'error';
}

/** Faixa de feedback (sucesso/erro) exibida no topo das telas. */
export function StatusBanner({ message, variant = 'success' }: StatusBannerProps) {
  const isSuccess = variant === 'success';

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          role={isSuccess ? 'status' : 'alert'}
          className={
            isSuccess
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm mb-6'
              : 'bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm mb-6'
          }
        >
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600" />
          )}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
