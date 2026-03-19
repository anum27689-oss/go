
"use client";

import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { pakistanCities, type City } from '@/lib/pakistan-cities';
import { UserAvatar } from '@/components/auth/UserAvatar';

// Helper function to parse time string
const parseTimeToDate = (timeStr: string, date: Date = new Date()) => {
    if (!timeStr || !timeStr.includes(':')) return new Date(0);
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};

const prayerNameKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function HomePage() {
  const { t, language } = useTranslation();
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{ name: string; countdown: string }>({ name: t('common.loading'), countdown: '' });
  const [isLoading, setIsLoading] = useState(true);

  const prayerNames = useMemo(() => ({
    'Fajr': t('prayer.fajr'),
    'Dhuhr': t('prayer.dhuhr'),
    'Asr': t('prayer.asr'),
    'Maghrib': t('prayer.maghrib'),
    'Isha': t('prayer.isha'),
  }), [t]);

  const calculateCountdown = useCallback((prayerTimes: {name: string, time: string}[]) => {
      const now = new Date();
      const sortedPrayers = prayerTimes
        .map(p => ({
          name: p.name,
          date: parseTimeToDate(p.time, now)
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      let nextPrayer = sortedPrayers.find(p => p.date > now);
      
      if (!nextPrayer) {
          // If all prayers for today have passed, the next prayer is Fajr tomorrow
          nextPrayer = sortedPrayers[0];
          nextPrayer.date.setDate(nextPrayer.date.getDate() + 1);
      }
      
      const minutesUntil = Math.max(0, Math.round((nextPrayer.date.getTime() - now.getTime()) / (1000 * 60)));
      const translatedName = prayerNames[nextPrayer.name as keyof typeof prayerNames] || nextPrayer.name;

      let countdownText = '';
      if (minutesUntil > 0) {
          countdownText = t('prayer.inMinutes').replace('{minutes}', String(minutesUntil));
      } else {
          countdownText = t('prayer.now');
      }

      setNextPrayerInfo({
          name: translatedName,
          countdown: countdownText
      });
  }, [t, prayerNames]);

  useEffect(() => {
    let city: City | null = null;
    const savedCityJSON = localStorage.getItem('selectedCity');
    
    try {
        city = savedCityJSON ? JSON.parse(savedCityJSON) : (pakistanCities.find(c => c.city === "Karachi") || null);
    } catch {
        city = pakistanCities.find(c => c.city === "Karachi") || null;
    }

    if (!city) {
        setIsLoading(false);
        setNextPrayerInfo({ name: t('prayer.selectCity'), countdown: '' });
        return;
    }

    const fetchAndSetPrayerTimes = async (city: City) => {
      setIsLoading(true);
      const method = localStorage.getItem('prayerCalculationMethod') || '2';
      const date = new Date();
      const dateString = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      const url = `https://api.aladhan.com/v1/timings/${dateString}?latitude=${city.lat}&longitude=${city.lng}&method=${method}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch prayer times');
        const data = await response.json();
        const timings = data.data.timings;
        
        const prayerTimes = prayerNameKeys.map(p => ({
          name: p,
          time: timings[p]
        }));
        
        // Initial calculation
        calculateCountdown(prayerTimes);
        
        // Set interval to update countdown every minute
        const intervalId = setInterval(() => calculateCountdown(prayerTimes), 60000); 

        setIsLoading(false);
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);

      } catch (error) {
        console.error("Error fetching prayer times:", error);
        setNextPrayerInfo({ name: 'Error', countdown: 'Could not load times' });
        setIsLoading(false);
      }
    };
    
    const interval = fetchAndSetPrayerTimes(city);

    return () => {
        interval.then(cleanup => cleanup && cleanup());
    }

  }, [calculateCountdown, t]);


  const title = useMemo(() => {
    const translated = t('home.title');
    const parts = translated.split(/<1>|<\/1>/);
    return (
        <>
            {parts[0]}
            <span className="text-primary">{parts[1]}</span>
            {parts[2]}
        </>
    )
  }, [t]);


  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 max-w-2xl mx-auto left-0 right-0">
        <Link href="/home" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">brightness_3</span>
            <h1 className="font-headline font-bold text-xl tracking-tight text-primary">{t('common.appName')}</h1>
        </Link>
        <UserAvatar />
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-28 px-6 max-w-2xl mx-auto w-full min-h-screen">
        {/* Hero Section: Dynamic Greeting */}
        <section className={cn("mb-10", language === 'en' && "mb-8")}>
            <p className="text-label-md font-medium text-secondary tracking-widest uppercase mb-2">{t('home.greeting')}</p>
            <h2 className={cn("font-headline font-extrabold text-4xl text-on-surface leading-tight", language === 'en' && "tracking-tight text-3xl")}>{title}</h2>
        </section>

        {/* Bento Grid Navigation */}
        <div className="grid grid-cols-2 gap-4">
            {/* 1. Prayer Times (Large Featured Card) */}
            <Link href="/prayer-times" className="col-span-2 flex flex-col justify-between items-start p-8 bg-primary rounded-lg text-on-primary h-56 relative overflow-hidden active:scale-[0.98] transition-transform">
                <div className="z-10 flex flex-col items-start h-full justify-between">
                    <span className="material-symbols-outlined text-4xl">schedule</span>
                    <div className="text-left">
                        <p className={cn("font-headline font-bold", language === 'en' ? "text-2xl" : "text-3xl")}>{t('home.prayerTimes')}</p>
                        <p className="opacity-80 text-sm">
                          {isLoading ? t('common.loading') : `${t('prayer.upNext')}: ${nextPrayerInfo.name} ${nextPrayerInfo.countdown}`}
                        </p>
                    </div>
                </div>
                {/* Abstract Pattern background */}
                <div className="absolute right-[-20%] top-[-10%] w-64 h-64 bg-primary-container rounded-full opacity-30 blur-3xl"></div>
            </Link>
            
            {/* 2. Tasbeeh Counter */}
            <Link href="/tasbeeh" className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-lg h-44 hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                <span className="material-symbols-outlined text-secondary text-3xl mb-4">adjust</span>
                <span className="font-headline font-bold text-lg text-on-surface">{t('home.tasbeeh')}</span>
            </Link>

            {/* 3. Qibla Direction */}
            <Link href="/qibla" className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-lg h-44 hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                <span className="material-symbols-outlined text-secondary text-3xl mb-4">explore</span>
                <span className="font-headline font-bold text-lg text-on-surface">{t('home.qibla')}</span>
            </Link>

            {/* 4. Quran Audio */}
            <Link href="/quran-audio" className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-lg h-44 hover:bg-surface-container-high transition-colors active:scale-95 duration-200 text-center">
                <span className="material-symbols-outlined text-secondary text-3xl mb-4">volume_up</span>
                <span className="font-headline font-bold text-lg text-on-surface">{t('home.quranAudio')}</span>
            </Link>

            {/* 5. Islamic Calendar */}
            <Link href="/islamic-calendar" className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-lg h-44 hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                <span className="material-symbols-outlined text-secondary text-3xl mb-4">calendar_month</span>
                <span className="font-headline font-bold text-lg text-on-surface">{t('home.calendar')}</span>
            </Link>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface/80 backdrop-blur-2xl flex justify-around items-center h-20 px-2 max-w-2xl mx-auto left-0 right-0 pb-[env(safe-area-inset-bottom)]">
        <Link href="/home" className="flex flex-col items-center justify-center gap-1 bg-primary text-on-primary rounded-xl p-2 h-14 w-16 transition-all duration-200 active:scale-90 tap-highlight-none">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
            <span className="text-xs font-bold">{t('nav.home')}</span>
        </Link>
        <Link href="/prayer-times" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant rounded-xl p-2 h-14 w-16 transition-all duration-200 active:scale-90 tap-highlight-none hover:bg-surface-container-high">
            <span className="material-symbols-outlined">schedule</span>
            <span className="text-xs font-medium">{t('nav.prayer')}</span>
        </Link>
        <Link href="/tasbeeh" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant rounded-xl p-2 h-14 w-16 transition-all duration-200 active:scale-90 tap-highlight-none hover:bg-surface-container-high">
            <span className="material-symbols-outlined">adjust</span>
            <span className="text-xs font-medium">{t('nav.tasbeeh')}</span>
        </Link>
        <Link href="/islamic-calendar" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant rounded-xl p-2 h-14 w-16 transition-all duration-200 active:scale-90 tap-highlight-none hover:bg-surface-container-high">
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="text-xs font-medium">{t('nav.calendar')}</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant rounded-xl p-2 h-14 w-16 transition-all duration-200 active:scale-90 tap-highlight-none hover:bg-surface-container-high">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-xs font-medium">{t('nav.settings')}</span>
        </Link>
      </nav>

      {/* Decorative Bottom Shadow Gradient */}
      <div className="fixed bottom-20 left-0 w-full h-8 bg-gradient-to-t from-surface to-transparent pointer-events-none max-w-2xl mx-auto right-0"></div>
    </div>
  );
}
