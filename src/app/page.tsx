
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center bg-spiritual-gradient overflow-hidden">
      {/* Subtle Ambient Background Element */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-container/10 blur-[120px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-secondary-container/20 blur-[100px]"></div>
      </div>
      {/* Centerpiece Container */}
      <div className="relative z-10 flex flex-col items-center gap-12 max-w-xs text-center">
        {/* Central Branding Lockup */}
        <div className="flex flex-col items-center gap-8">
          {/* Refined Crescent Moon Icon */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-40 h-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="relative w-20 h-20 bg-white dark:bg-surface-container-high rounded-full shadow-sm flex items-center justify-center border border-primary/10">
              <span className="material-symbols-outlined text-[44px] text-primary" style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}>
                nights_stay
              </span>
            </div>
          </div>
          {/* Typography Section */}
          <div className="space-y-1 text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">
              Islamic Daily
            </h1>
            <p className="font-headline text-lg tracking-[0.4em] font-light text-on-surface-variant uppercase ml-[0.4em]">
              Companion
            </p>
          </div>
          {/* Subtle Accent */}
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        </div>
      </div>
      {/* Footer / Metadata (Editorial Style) */}
      <div className="absolute bottom-16 left-0 w-full flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse [animation-delay:0.4s]"></div>
          </div>
          <p className="font-body text-[10px] text-on-surface-variant/40 tracking-[0.3em] uppercase">Est. 2026</p>
        </div>
      </div>
      {/* Decorative Pattern (Asymmetric Editorial Touch) */}
      <div className="absolute top-12 left-12 opacity-5 pointer-events-none">
        <div className="grid grid-cols-2 gap-4">
          <div className="w-1 h-1 bg-on-surface rounded-full"></div>
          <div className="w-1 h-1 bg-on-surface rounded-full"></div>
          <div className="w-1 h-1 bg-on-surface rounded-full"></div>
          <div className="w-1 h-1 bg-on-surface rounded-full"></div>
        </div>
      </div>
    </main>
  );
}
