'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface MagicBentoItem {
  id?: string;
  colSpan?: number;
  rowSpan?: number;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface MagicBentoProps {
  columns?: number;
  rowHeight?: number;
  gap?: number;
  radius?: number;
  enableBorderGlow?: boolean;
  enableSpotlight?: boolean;
  spotlightRadius?: number;
  clickEffect?: boolean;
  enableStars?: boolean;
  particleCount?: number;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  textAutoHide?: boolean;
  intro?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function MagicBento({
  columns = 4,
  rowHeight = 200,
  gap = 12,
  radius = 20,
  enableBorderGlow = true,
  enableSpotlight = true,
  spotlightRadius = 300,
  clickEffect = true,
  children,
  className = '',
}: MagicBentoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -1000, y: -1000 });
      }}
      className={`relative grid transition-all ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap}px`,
        borderRadius: `${radius}px`,
      }}
    >
      {/* Luz ambiente de destaque compartilhada (Spotlight) */}
      {enableSpotlight && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100 z-10"
          style={{
            background: `radial-gradient(${spotlightRadius}px circle at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.08), transparent 80%)`,
          }}
        />
      )}

      {children}
    </div>
  );
}

export interface MagicBentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4;
  radius?: number;
  enableBorderGlow?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function MagicBentoCard({
  children,
  className = '',
  colSpan = 1,
  radius = 24,
  enableBorderGlow = true,
  onClick,
  style = {},
}: MagicBentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardMouse, setCardMouse] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const colSpanClass = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-3',
    4: 'col-span-1 md:col-span-2 lg:col-span-4',
  }[colSpan];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCardMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCardMouse({ x: -1000, y: -1000 });
      }}
      onClick={onClick}
      className={`group relative overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow ${colSpanClass} ${className}`}
      style={{
        borderRadius: `${radius}px`,
        ...style,
      }}
    >
      {/* Borda Iluminada reativa ao cursor (Cursor Border Glow) */}
      {enableBorderGlow && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-200 opacity-100 z-10"
          style={{
            background: `radial-gradient(160px circle at ${cardMouse.x}px ${cardMouse.y}px, rgba(239, 68, 68, 0.25), transparent 70%)`,
            borderRadius: `${radius}px`,
          }}
        />
      )}

      {/* Brilho interno do card */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isHovered
            ? `radial-gradient(220px circle at ${cardMouse.x}px ${cardMouse.y}px, rgba(239, 68, 68, 0.04), transparent 80%)`
            : undefined,
        }}
      />

      <div className="relative z-20 h-full flex flex-col justify-between p-5 sm:p-6">
        {children}
      </div>
    </motion.div>
  );
}

export default MagicBento;
