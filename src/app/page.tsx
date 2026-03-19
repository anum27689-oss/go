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
        <div className="relative z-10 flex flex-col items-center text-center">
            {/* Minimalist Crescent Icon */}
            <div className="relative flex items-center justify-center">
                {/* Outer Glow */}
                <div className="absolute w-32 h-32 rounded-full bg-secondary-container/10 blur-3xl animate-pulse"></div>
                {/* Icon Shell */}
                <div className="relative w-24 h-24 bg-surface-container-lowest flex items-center justify-center rounded-full ethereal-glow">
                    <span className="material-symbols-outlined text-[64px] text-secondary" style={{fontVariationSettings: "'FILL' 0, 'wght' 100"}}>
                        brightness_3
                    </span>
                </div>
            </div>
        </div>
    </main>
  );
}
