
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from "@/lib/utils";

export default function IslamicCalendarPage() {
    const router = useRouter();
    const [viewedDate, setViewedDate] = useState(new Date());
    const [hijriHeaderParts, setHijriHeaderParts] = useState<{ month: string; year: string } | null>(null);

    const today = new Date();
    
    useEffect(() => {
        const firstDayOfViewedMonth = new Date(viewedDate.getFullYear(), viewedDate.getMonth(), 1);
        try {
            const hijriMonthFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'long' });
            const hijriYearFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { year: 'numeric' });
            setHijriHeaderParts({
                month: hijriMonthFormatter.format(firstDayOfViewedMonth),
                year: hijriYearFormatter.format(firstDayOfViewedMonth).split(' ')[0],
            });
        } catch (e) {
            console.error("Could not format Hijri header date:", e);
            setHijriHeaderParts(null);
        }
    }, [viewedDate]);

    const handlePrevMonth = () => {
        setViewedDate(current => new Date(current.getFullYear(), current.getMonth() - 1, 1));
    };
    
    const handleNextMonth = () => {
        setViewedDate(current => new Date(current.getFullYear(), current.getMonth() + 1, 1));
    };

    const isCurrentMonthViewed = today.getFullYear() === viewedDate.getFullYear() && today.getMonth() === viewedDate.getMonth();
    const todayDayOfMonth = isCurrentMonthViewed ? today.getDate() : -1;

    const daysInMonth = new Date(viewedDate.getFullYear(), viewedDate.getMonth() + 1, 0).getDate();
    const firstDayOfWeek = new Date(viewedDate.getFullYear(), viewedDate.getMonth(), 1).getDay();

    const calendarDays = [];
    const hijriDayFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric' });
    const hijriMonthFormatterNum = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'numeric' });
    
    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-${i}`}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === todayDayOfMonth;
        const dateForDay = new Date(viewedDate.getFullYear(), viewedDate.getMonth(), day);
        
        let hijriDay, isMonthEnd = false;

        try {
            hijriDay = hijriDayFormatter.format(dateForDay);
            const hijriMonthNum = hijriMonthFormatterNum.format(dateForDay);

            const nextGregorianDay = new Date(dateForDay);
            nextGregorianDay.setDate(dateForDay.getDate() + 1);
            const currentHijriMonth = hijriMonthFormatterNum.format(dateForDay);
            const nextHijriMonth = hijriMonthFormatterNum.format(nextGregorianDay);

            if (currentHijriMonth !== nextHijriMonth) {
                isMonthEnd = true;
            }

        } catch {
            hijriDay = '-';
        }

        calendarDays.push(
            <div
                key={day}
                className={cn(
                    'aspect-square rounded-lg p-2 flex flex-col items-center justify-center relative group cursor-pointer transition-all',
                    {
                        'bg-primary text-on-primary shadow-xl shadow-primary/20': isToday,
                        'bg-surface-container-lowest hover:bg-surface-container': !isToday,
                    }
                )}
            >
                <span className={cn(
                    'font-manrope font-extrabold text-2xl',
                    isToday ? 'text-on-primary' : 'text-primary'
                )}>
                    {hijriDay}
                </span>
                <span className={cn(
                    'absolute top-2 left-2 font-manrope font-medium text-xs',
                    isToday ? 'text-on-primary/70' : 'text-on-surface-variant/80'
                )}>
                    {day}
                </span>
                {isMonthEnd && (
                    <span className={cn(
                        'absolute bottom-2 text-[10px] font-bold',
                        isToday ? 'text-on-primary/90' : 'text-secondary'
                    )}>
                        Month End
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="bg-surface text-on-surface min-h-screen pb-24">
            <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 max-w-2xl mx-auto left-0 right-0">
                <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                    <span className="material-symbols-outlined text-on-surface">arrow_back</span>
                </button>
                <Link href="/home">
                    <h1 className="text-primary font-manrope font-extrabold tracking-tighter text-xl">Islamic Companion</h1>
                </Link>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                    <span className="material-symbols-outlined text-on-surface">account_circle</span>
                </button>
            </header>

            <main className="pt-24 px-6 max-w-2xl mx-auto">
                <section className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-secondary font-semibold tracking-wider text-sm uppercase">Lunar Cycle</span>
                            {hijriHeaderParts ? (
                                <h2 className="font-manrope font-extrabold text-4xl md:text-5xl text-on-surface mt-2 tracking-tight">{hijriHeaderParts.month} {hijriHeaderParts.year} AH</h2>
                            ): (
                                <h2 className="font-manrope font-extrabold text-4xl md:text-5xl text-on-surface mt-2 tracking-tight">Loading...</h2>
                            )}
                        </div>
                        <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-full">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-surface-container-high rounded-full transition-colors" aria-label="Previous month">
                                <span className="material-symbols-outlined text-on-surface">chevron_left</span>
                            </button>
                             <button onClick={() => setViewedDate(new Date())} className="px-4 font-manrope font-bold text-sm text-center w-28 hover:bg-surface-container-high rounded-full py-1">
                                Today
                            </button>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-surface-container-high rounded-full transition-colors" aria-label="Next month">
                                <span className="material-symbols-outlined text-on-surface">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </section>
                
                <div className="grid grid-cols-7 gap-1.5 mb-8">
                    <div className="text-center py-1 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Sun</div>
                    <div className="text-center py-1 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Mon</div>
                    <div className="text-center py-1 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Tue</div>
                    <div className="text-center py-1 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Wed</div>
                    <div className="text-center py-1 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Thu</div>
                    <div className="text-center py-1 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Fri</div>
                    <div className="text-center py-1 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Sat</div>
                    {calendarDays}
                </div>
            </main>

            <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/80 backdrop-blur-2xl flex justify-around items-center h-20 px-4 max-w-2xl mx-auto left-0 right-0">
                <Link href="/home" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90 tap-highlight-none">
                    <span className="material-symbols-outlined">home</span>
                    <span className="font-label text-sm font-medium tracking-wide">Home</span>
                </Link>
                <Link href="/prayer-times" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90 tap-highlight-none">
                     <span className="material-symbols-outlined">schedule</span>
                    <span className="font-label text-sm font-medium tracking-wide">Prayer</span>
                </Link>
                <Link href="/tasbeeh" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90 tap-highlight-none">
                    <span className="material-symbols-outlined">adjust</span>
                    <span className="font-label text-sm font-medium tracking-wide">Tasbeeh</span>
                </Link>
                 <Link href="/islamic-calendar" className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-5 py-1.5 transition-all tap-highlight-none active:scale-90">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>calendar_month</span>
                    <span className="font-label text-sm font-medium tracking-wide">Calendar</span>
                </Link>
                <Link href="/settings" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90 tap-highlight-none">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="font-label text-sm font-medium tracking-wide">Settings</span>
                </Link>
            </nav>
        </div>
    );
}
