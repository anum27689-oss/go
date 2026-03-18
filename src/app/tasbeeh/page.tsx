"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TASBEEH_COUNT_KEY = 'tasbeeh_count';
const STREAK_START_DATE_KEY = 'tasbeeh_streak_start_date';
const LAST_SESSION_TAPS_KEY = 'tasbeeh_last_session_taps';

export default function TasbeehCounterPage() {
  const [count, setCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastSessionTaps, setLastSessionTaps] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // On initial load, set count from localStorage or to 0
    const savedCount = localStorage.getItem(TASBEEH_COUNT_KEY);
    setCount(savedCount ? parseInt(savedCount, 10) : 0);
    
    // Set last session taps from localStorage or to 0
    const savedLastSessionTaps = localStorage.getItem(LAST_SESSION_TAPS_KEY);
    setLastSessionTaps(savedLastSessionTaps ? parseInt(savedLastSessionTaps, 10) : 0);

    // Calculate streak and determine if history should be shown
    const streakStartDate = localStorage.getItem(STREAK_START_DATE_KEY);
    if (streakStartDate) {
      const startDate = new Date(streakStartDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      // Add 1 to include the start day
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; 
      setStreak(diffDays);
      if (diffDays >= 12) {
        setShowHistory(true);
      }
    } else {
      setStreak(0);
    }
  }, []);

  useEffect(() => {
    // This effect runs whenever 'count' changes.
    localStorage.setItem(TASBEEH_COUNT_KEY, String(count));
    
    // If user starts tapping (count becomes 1) and there is no streak, start one.
    if (count > 0 && streak === 0) {
      const today = new Date().toISOString();
      localStorage.setItem(STREAK_START_DATE_KEY, today);
      setStreak(1);
    }
  }, [count, streak]);

  const increment = () => setCount(prev => prev + 1);

  const reset = () => {
    setLastSessionTaps(count);
    localStorage.setItem(LAST_SESSION_TAPS_KEY, String(count));
    setCount(0);
  };
  
  const dailyGoal = 100;
  const goalProgress = count % dailyGoal;
  const progressPercentage = (goalProgress / dailyGoal) * 100;

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
        {/* TopAppBar */}
        <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="hover:bg-surface-container-high transition-colors p-2 rounded-full active:scale-95 duration-200">
                    <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
                </button>
                <Link href="/home">
                    <h1 className="text-primary font-manrope font-extrabold tracking-tighter text-xl">Islamic Companion</h1>
                </Link>
            </div>
            <div className="flex items-center gap-2">
                <button className="hover:bg-surface-container-high transition-colors p-2 rounded-full active:scale-95 duration-200">
                    <span className="material-symbols-outlined text-on-surface-variant">brightness_3</span>
                </button>
                <button className="hover:bg-surface-container-high transition-colors p-2 rounded-full active:scale-95 duration-200">
                    <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
                </button>
            </div>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-grow pt-24 pb-32 px-6 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
            {/* Editorial Header Section */}
            <section className="w-full text-center mb-12">
                <p className="text-secondary font-headline font-bold tracking-widest uppercase text-xs mb-2">Devotion</p>
                <h2 className="text-on-surface font-headline font-extrabold text-4xl mb-4 leading-tight">Digital Tasbeeh</h2>
                <div className="inline-flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                    <span className="text-on-surface-variant text-label-md font-medium">Subhan Allah</span>
                </div>
            </section>

            {/* Counter Display & Interaction Area */}
            <div className="relative w-full flex flex-col items-center">
                {/* Digital Number Display */}
                <div className="mb-12 text-center">
                    <div className="font-headline font-extrabold text-[120px] leading-none text-primary tracking-tighter">
                        {String(count).padStart(3, '0')}
                    </div>
                    <div className="text-on-surface-variant font-body text-sm tracking-[0.2em] uppercase opacity-60">Current Count</div>
                </div>

                {/* Tactile Counter Button */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-125"></div>
                    <button onClick={increment} className="relative w-64 h-64 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex flex-col items-center justify-center tasbeeh-glow active:scale-95 transition-all duration-200 group">
                        <div className="absolute inset-0 rounded-full border-4 border-on-primary/10 scale-90"></div>
                        <span className="material-symbols-outlined text-5xl mb-2 opacity-90" style={{fontVariationSettings: "'wght' 200"}}>touch_app</span>
                        <span className="font-headline font-bold text-lg tracking-wide">TAP</span>
                        <div className="absolute inset-0 rounded-full bg-white/5 scale-75 opacity-0 group-active:opacity-100 group-active:scale-100 transition-all duration-300"></div>
                    </button>
                </div>

                {/* Reset Action */}
                <div className="mt-16 flex flex-col items-center gap-6">
                    <button onClick={reset} className="flex items-center gap-2 px-8 py-4 rounded-xl bg-surface-container-highest text-on-surface-variant hover:bg-surface-dim active:scale-95 transition-all font-body font-semibold">
                        <span className="material-symbols-outlined text-xl">refresh</span>
                        <span>Reset Counter</span>
                    </button>
                    {/* Goal Progress Visualization */}
                    <div className="w-48 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: `${progressPercentage}%`}}></div>
                    </div>
                    <p className="text-on-surface-variant text-xs font-medium tracking-wide">{goalProgress} / {dailyGoal} Daily Goal</p>
                </div>
            </div>

            {/* Secondary Info Cards (Bento Style) */}
            {showHistory && (
              <section className="grid grid-cols-2 gap-4 w-full mt-16">
                  <div className="bg-surface-container-low p-5 rounded-lg border border-outline-variant/15">
                      <span className="material-symbols-outlined text-secondary mb-3" style={{fontVariationSettings: "'FILL' 1"}}>history</span>
                      <p className="text-on-surface-variant text-xs font-medium mb-1">Last Session</p>
                      <p className="text-on-surface font-headline font-bold text-lg">{lastSessionTaps} Taps</p>
                  </div>
                  <div className="bg-surface-container-low p-5 rounded-lg border border-outline-variant/15">
                      <span className="material-symbols-outlined text-secondary mb-3" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
                      <p className="text-on-surface-variant text-xs font-medium mb-1">Streak</p>
                      <p className="text-on-surface font-headline font-bold text-lg">{streak} Days</p>
                  </div>
              </section>
            )}
        </main>
        
        {/* BottomNavBar */}
        <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/80 backdrop-blur-2xl flex justify-around items-center h-20 px-4">
            <Link href="/home" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 tap-highlight-none active:scale-90 transition-transform">
                <span className="material-symbols-outlined">home</span>
                <span className="font-inter text-label-md font-medium tracking-wide mt-1">Home</span>
            </Link>
            <Link href="/prayer-times" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 tap-highlight-none active:scale-90 transition-transform">
                <span className="material-symbols-outlined">schedule</span>
                <span className="font-inter text-label-md font-medium tracking-wide mt-1">Prayer</span>
            </Link>
            <Link href="/tasbeeh" className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-5 py-1.5 transition-all tap-highlight-none active:scale-90">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>adjust</span>
                <span className="font-inter text-label-md font-medium tracking-wide">Tasbeeh</span>
            </Link>
            <Link href="/settings" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 tap-highlight-none active:scale-90 transition-transform">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-inter text-label-md font-medium tracking-wide mt-1">Settings</span>
            </Link>
        </nav>
    </div>
  );
}
