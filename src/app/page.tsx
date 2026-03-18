"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Moon } from 'lucide-react';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background animate-fadeIn">
      <div className="flex flex-col items-center gap-4">
        <Moon className="w-20 h-20 text-primary animate-pulse" />
        <h1 className="text-3xl font-bold text-primary tracking-wider">
          Islamic Daily Companion
        </h1>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
