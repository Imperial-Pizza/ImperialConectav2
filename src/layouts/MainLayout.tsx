import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className='min-h-screen w-full bg-slate-900'>
      {children}
    </div>
  );
}
