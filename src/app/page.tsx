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
    <main className="relative h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden">
        {/* Centerpiece Container */}
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            {/* App Icon */}
            <div className="relative w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                </svg>
            </div>
            {/* Branding Text Cluster */}
            <div>
                <h1 className="font-headline text-3xl font-bold text-foreground">Islamic Companion</h1>
                <p className="text-muted-foreground">Your daily guide</p>
            </div>
        </div>
        {/* Loading Indicator */}
        <div className="absolute bottom-20 w-full flex justify-center">
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-primary animate-pulse" style={{ animationName: 'loading-bar', animationDuration: '2s', animationIterationCount: 'infinite' }}></div>
            </div>
        </div>

        <style jsx>{`
            @keyframes loading-bar {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(200%); }
                100% { transform: translateX(-100%); }
            }
        `}</style>
    </main>
  );
}
