"use client";

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 max-w-2xl mx-auto left-0 right-0">
        <Link href="/home" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">brightness_3</span>
            <h1 className="font-headline font-bold text-xl tracking-tight text-primary">Islamic Companion</h1>
        </Link>
        <button className="hover:bg-surface-container-high transition-colors p-2 rounded-full active:scale-95 duration-200">
            <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-44 px-6 max-w-2xl mx-auto w-full min-h-screen">
        {/* Hero Section: Dynamic Greeting */}
        <section className="mb-10">
            <p className="text-label-md font-medium text-secondary tracking-widest uppercase mb-2">As-salaam-alaikum</p>
            <h2 className="font-headline font-extrabold text-4xl text-on-surface leading-tight">Your path to <br/><span className="text-primary">peace and devotion</span></h2>
        </section>

        {/* Bento Grid Navigation */}
        <div className="grid grid-cols-2 gap-4">
            {/* 1. Prayer Times (Large Featured Card) */}
            <Link href="/prayer-times" className="col-span-2 flex flex-col justify-between items-start p-8 bg-primary rounded-lg text-on-primary h-56 relative overflow-hidden active:scale-[0.98] transition-transform">
                <div className="z-10 flex flex-col items-start h-full justify-between">
                    <span className="material-symbols-outlined text-4xl">schedule</span>
                    <div className="text-left">
                        <p className="font-headline font-bold text-2xl">Prayer Times</p>
                        <p className="opacity-80 text-sm">Next: Asr at 3:45 PM</p>
                    </div>
                </div>
                {/* Abstract Pattern background */}
                <div className="absolute right-[-20%] top-[-10%] w-64 h-64 bg-primary-container rounded-full opacity-30 blur-3xl"></div>
            </Link>
            
            {/* 2. Tasbeeh Counter */}
            <Link href="/tasbeeh" className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-lg h-44 hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                <span className="material-symbols-outlined text-secondary text-3xl mb-4">adjust</span>
                <span className="font-headline font-bold text-lg text-on-surface">Tasbeeh</span>
            </Link>

            {/* 3. Qibla Direction */}
            <Link href="/qibla" className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-lg h-44 hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                <span className="material-symbols-outlined text-secondary text-3xl mb-4">explore</span>
                <span className="font-headline font-bold text-lg text-on-surface">Qibla</span>
            </Link>

            {/* 4. Quran Audio */}
            <Link href="/quran-audio" className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-lg h-44 hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                <span className="material-symbols-outlined text-secondary text-3xl mb-4">volume_up</span>
                <span className="font-headline font-bold text-lg text-on-surface">Quran Audio</span>
            </Link>

            {/* 5. Islamic Calendar */}
            <Link href="/islamic-calendar" className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-lg h-44 hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                <span className="material-symbols-outlined text-secondary text-3xl mb-4">calendar_today</span>
                <span className="font-headline font-bold text-lg text-on-surface">Calendar</span>
            </Link>
        </div>

        {/* Banner Ad Placeholder */}
        <section className="mt-10 mb-6">
            <div className="w-full h-24 bg-surface-container-highest rounded-lg flex items-center justify-center overflow-hidden border border-outline-variant/15">
                <div className="text-center">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Sponsored Content</p>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-xl">card_giftcard</span>
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-on-surface">Support your local Masjid</p>
                            <p className="text-[10px] text-on-surface-variant">Donate today to help the community</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/80 backdrop-blur-2xl flex justify-around items-center h-20 px-4 max-w-2xl mx-auto left-0 right-0">
        {/* Home (Active) */}
        <Link href="/home" className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-5 py-1.5 transition-all active:scale-90">
            <span className="material-symbols-outlined material-symbols-fill" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            <span className="font-label text-sm font-medium tracking-wide">Home</span>
        </Link>
        {/* Prayer */}
        <Link href="/prayer-times" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90">
            <span className="material-symbols-outlined">schedule</span>
            <span className="font-label text-sm font-medium tracking-wide">Prayer</span>
        </Link>
        {/* Tasbeeh */}
        <Link href="/tasbeeh" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90">
            <span className="material-symbols-outlined">adjust</span>
            <span className="font-label text-sm font-medium tracking-wide">Tasbeeh</span>
        </Link>
        {/* Settings */}
        <Link href="/settings" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label text-sm font-medium tracking-wide">Settings</span>
        </Link>
      </nav>

      {/* Decorative Bottom Shadow Gradient */}
      <div className="fixed bottom-20 left-0 w-full h-8 bg-gradient-to-t from-surface to-transparent pointer-events-none max-w-2xl mx-auto right-0"></div>
    </div>
  );
}
