'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  activeColorClass?: string;
  ariaLabel?: string;
  align?: 'left' | 'right';
  fullWidth?: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  className = '',
  activeColorClass = 'bg-red-50/80 border-red-300 text-red-900',
  ariaLabel,
  align = 'left',
  fullWidth = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const isDefaultSelected = options.length > 0 && options[0].value === value;

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Fecha no ESC
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? 'w-full block' : 'inline-block shrink-0'} text-left`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || selectedOption?.label || placeholder}
        className={`${
          fullWidth ? 'w-full' : ''
        } inline-flex items-center justify-between gap-2.5 px-3.5 py-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-red-600/10 active:scale-[0.99] ${
          !isDefaultSelected
            ? activeColorClass
            : 'bg-slate-50/90 hover:bg-slate-100/80 border-slate-200/90 text-slate-700 hover:text-slate-900'
        } ${className}`}
      >
        <span className="truncate max-w-[280px]">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-slate-700' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="listbox"
            className={`absolute ${
              align === 'right' ? 'right-0' : 'left-0'
            } mt-1.5 ${
              fullWidth ? 'w-full min-w-full' : 'min-w-full w-max max-w-xs'
            } bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-xl shadow-slate-900/10 z-50 max-h-64 overflow-y-auto space-y-0.5`}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              const Icon = opt.icon;

              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-50/80 text-blue-900 font-bold'
                      : 'text-slate-700 font-semibold hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {Icon && <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                    <span className="truncate">{opt.label}</span>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
