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
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-secondary"
                        >
                        <path
                        d="M19.347 11.832c-.17-.714-.42-1.393-.746-2.022a5.572 5.572 0 0 0-1.428-1.999c-.31-.274-.64-.52-.988-.73C15.144 6.35 13.61 5.91 12 5.91s-3.144.44-4.185 1.17c-.348.21-.678.456-.988.73a5.572 5.572 0 0 0-1.428 1.999c-.325.629-.575 1.308-.746 2.022-.17.713-.27 1.455-.282 2.214-.013.759 0 1.51.106 2.244.106.733.3 1.45.576 2.13.275.68.625 1.314 1.045 1.884.28.38.598.73.953 1.045.244.21.5.39.773.555 1.15.69 2.516 1.08 4.02 1.08s2.87-.39 4.02-1.08c.273-.165.53-.345.773-.555.355-.315.673-.665.953-1.045.42-.57.77-1.204 1.045-1.884.276-.68.47-1.407.576-2.13.106-.734.119-1.485.106-2.244-.012-.76-.112-1.501-.282-2.214Zm-1.83 5.48c-.22.56-.51.98-.85 1.25-.6.47-1.5.83-2.66.92v-8.02h2.52c.86 0 1.56.7 1.56 1.56 0 .86-.7 1.56-1.56 1.56h-.96v2.73Zm-4.997 2.17c-.4 0-.77-.16-1.04-.44-.27-.28-.43-.65-.43-1.04s.16-.76.43-1.04c.27-.28.64-.44 1.04-.44.4 0 .77.16 1.04.44.27.28.43.65.43 1.04s-.16.76-.43 1.04c-.27.28-.64-.44-1.04-.44Zm2.48-15.41c.21.32.32.7.32 1.12 0 .5-.16.94-.49 1.28-.33.34-.76.51-1.28.51-.52 0-.95-.17-1.28-.51-.33-.34-.49-.78-.49-1.28 0-.42.11-.8.32-1.12.22-.32.5-.56.86-.73.36-.17.75-.25 1.18-.25.43 0 .82.08 1.18.25.36.17.64.4.86.73Zm-7.46 9.53V10.92c1.16-.1 2.06-.46 2.66-.92.34-.27.63-.69.85-1.25V6.02c-.5.18-1.04.27-1.6.27-1.63 0-3.1-.47-4.22-1.25-.1-.07-.18-.14-.26-.22-.3-.3-.54-.64-.72-1.02C6.01 4.7 5.91 5.58 5.91 6.5c0 .94.13 1.82.38 2.64.25.82.6 1.57 1.04 2.24.44.67.97 1.26 1.57 1.76.6.5 1.28.9 2.02 1.18.08 0 .15.02.23.02h.08c.7-.07 1.34-.28 1.91-.6Zm.23 2.73h-.96c-.86 0-1.56-.7-1.56-1.56 0-.86.7-1.56 1.56-1.56h2.52v8.02c-1.16-.1-2.06-.46-2.66-.92-.34-.27-.63-.69-.85-1.25v-2.73Z"
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
