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
    <main className="relative h-screen w-full flex flex-col items-center justify-center bg-surface-bright overflow-hidden">
        {/* Subtle Ambient Background Element */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-container/10 blur-[120px]"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-secondary-container/20 blur-[100px]"></div>
        </div>
        
        {/* Centerpiece Container */}
        <div className="relative z-10 flex flex-col items-center gap-12 max-w-xs text-center">
            {/* Minimalist Crescent Icon */}
            <div className="relative flex items-center justify-center">
                {/* Outer Glow */}
                <div className="absolute w-32 h-32 rounded-full bg-secondary-container/10 blur-3xl animate-pulse"></div>
                {/* Icon Shell */}
                <div className="relative w-24 h-24 bg-surface-container-lowest flex items-center justify-center rounded-full shadow-lg">
                    <span className="material-symbols-outlined text-[64px] text-secondary" style={{fontVariationSettings: "'FILL' 0, 'wght' 100"}}>
                        brightness_3
                    </span>
                </div>
            </div>
            
            {/* Branding Text Cluster */}
            <div className="space-y-3">
                <h1 className="font-headline tracking-tighter text-on-surface">
                    <span className="block text-3xl font-extrabold text-primary leading-tight">Islamic Daily</span>
                    <span className="block text-base font-light tracking-widest text-on-surface-variant uppercase">Companion</span>
                </h1>
                {/* Editorial Accent Line */}
                <div className="flex justify-center pt-2">
                    <div className="h-[1px] w-8 bg-outline-variant/30"></div>
                </div>
            </div>
        </div>

        {/* Footer / Metadata (Editorial Style) */}
        <div className="absolute bottom-16 left-0 w-full flex flex-col items-center gap-6">
            <p className="font-body text-xs text-on-surface-variant/60 tracking-[0.2em] font-medium">EST. 2024</p>
            {/* Subtle Loading Indicator */}
            <div className="flex gap-2 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/20"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/20"></div>
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
