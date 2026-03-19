"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';

export default function Splash() {
  const router = useRouter();
  const { t } = useTranslation();

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
                    <svg
                      width="56"
                      height="56"
                      viewBox="0 0 100 100"
                      className="text-secondary"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M80.6,23.1C65.5,6.5,43.2-1.9,23.1,3.8c-1.8,0.5-3,2.4-2.5,4.2c0.5,1.8,2.4,3,4.2,2.5c16.3-4.7,34.1,2.1,46.3,16.5 c13.2,15.5,15.6,36.5,6,54.2C67.3,95.7,53,101.8,39,100.8c-1.8-0.2-3.5,1.1-3.7,2.9c-0.2,1.8,1.1,3.5,2.9,3.7 c15.9,1.1,32.3-5.7,43.3-22.1C93.7,65.8,92.9,43.1,80.6,23.1z"
                      />
                      <polygon
                        fill="currentColor"
                        points="69.4,36.7 63.5,47.9 51.6,47.9 60.6,55.1 57.2,66.6 66.5,59.9 75.8,66.6 72.4,55.1 81.4,47.9 69.4,47.9"
                      />
                    </svg>
                </div>
            </div>
            
            {/* Branding Text Cluster */}
            <div className="space-y-3">
                <h1 className="font-headline tracking-tighter text-on-surface">
                    <span className="block text-3xl font-extrabold text-primary leading-tight">{t('splash.title1')}</span>
                    <span className="block text-base font-light tracking-widest text-on-surface-variant uppercase">{t('splash.title2')}</span>
                </h1>
                 {/* Editorial Accent Line */}
                <div className="flex justify-center pt-2">
                    <div className="h-[1px] w-8 bg-outline-variant/30"></div>
                </div>
            </div>
        </div>

        {/* Footer / Loading Indicator */}
        <div className="absolute bottom-16 left-0 w-full flex flex-col items-center gap-6">
            {/* Subtle Loading Indicator */}
            <div className="flex gap-2 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/20"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/20"></div>
            </div>
        </div>
    </main>
  );
}
