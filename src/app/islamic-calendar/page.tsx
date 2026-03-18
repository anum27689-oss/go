
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const islamicMonths = [
    "Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani",
    "Jumada al-ula", "Jumada al-ukhra", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

export default function IslamicCalendarPage() {
    const router = useRouter();
    const [viewedDate, setViewedDate] = useState(new Date());
    const [hijriHeaderParts, setHijriHeaderParts] = useState<{ month: string; year: string } | null>(null);
    const [todayHijriParts, setTodayHijriParts] = useState<{ day: string; month: string; year: string } | null>(null);

    const today = new Date();
    
    // Effect for the main header, depends on the month being viewed
    useEffect(() => {
        const firstDayOfViewedMonth = new Date(viewedDate.getFullYear(), viewedDate.getMonth(), 1);
        try {
            const hijriMonthFormatter = new Intl.DateTimeFormat('en-u-ca-islamic', { month: 'long' });
            const hijriYearFormatter = new Intl.DateTimeFormat('en-u-ca-islamic', { year: 'numeric' });
            setHijriHeaderParts({
                month: hijriMonthFormatter.format(firstDayOfViewedMonth),
                year: hijriYearFormatter.format(firstDayOfViewedMonth).split(' ')[0],
            });
        } catch (e) {
            console.error("Could not format Hijri header date:", e);
            setHijriHeaderParts(null);
        }
    }, [viewedDate]);

    // Effect for today's date info, runs once
    useEffect(() => {
        try {
            const hijriDayFormatter = new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric' });
            const hijriMonthFormatter = new Intl.DateTimeFormat('en-u-ca-islamic', { month: 'long' });
            const hijriYearFormatter = new Intl.DateTimeFormat('en-u-ca-islamic', { year: 'numeric' });

            setTodayHijriParts({
                day: hijriDayFormatter.format(today),
                month: hijriMonthFormatter.format(today),
                year: hijriYearFormatter.format(today).split(' ')[0], // "1445 AH" -> "1445"
            });
        } catch (e) {
            console.error("Could not format today's Hijri date:", e);
            setTodayHijriParts(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePrevMonth = () => {
        setViewedDate(current => new Date(current.getFullYear(), current.getMonth() - 1, 1));
    };
    
    const handleNextMonth = () => {
        setViewedDate(current => new Date(current.getFullYear(), current.getMonth() + 1, 1));
    };

    const gregorianMonthName = viewedDate.toLocaleString('default', { month: 'long' });
    const gregorianYear = viewedDate.getFullYear();
    
    const isCurrentMonthViewed = today.getFullYear() === gregorianYear && today.getMonth() === viewedDate.getMonth();
    const todayDayOfMonth = isCurrentMonthViewed ? today.getDate() : -1;

    const daysInMonth = new Date(viewedDate.getFullYear(), viewedDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(viewedDate.getFullYear(), viewedDate.getMonth(), 1).getDay();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === todayDayOfMonth;
        calendarDays.push(
            <div key={day} className={`aspect-square rounded-lg p-2 flex flex-col justify-between group cursor-pointer transition-all ${isToday ? 'bg-primary text-on-primary shadow-xl shadow-primary/10' : 'bg-surface-container-lowest hover:bg-secondary-container'}`}>
                <span className={`font-manrope font-medium text-xs ${isToday ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}`}>{gregorianMonthName.substring(0, 3)} {day}</span>
                 {isToday && <div className="text-[10px] absolute bottom-2 left-2 font-bold uppercase tracking-tighter opacity-70">Today</div>}
                 <span className={`font-manrope font-extrabold text-lg self-end ${isToday ? '' : 'text-primary'}`}>
                    {
                        (() => {
                            try {
                                const dateForDay = new Date(viewedDate.getFullYear(), viewedDate.getMonth(), day);
                                return new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric' }).format(dateForDay);
                            } catch {
                                return '-';
                            }
                        })()
                    }
                </span>
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
                                <h2 className="font-manrope font-extrabold text-4xl md:text-5xl text-on-surface mt-2 tracking-tight">{hijriHeaderParts.month} {hijriHeaderParts.year}</h2>
                            ): (
                                <h2 className="font-manrope font-extrabold text-4xl md:text-5xl text-on-surface mt-2 tracking-tight">Loading...</h2>
                            )}
                            <p className="text-on-surface-variant font-medium mt-1">{gregorianMonthName} {gregorianYear}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-full">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-surface-container-high rounded-full transition-colors" aria-label="Previous month">
                                <span className="material-symbols-outlined text-on-surface">chevron_left</span>
                            </button>
                            <span className="px-4 font-manrope font-bold text-sm text-center w-28">{gregorianMonthName} {gregorianYear}</span>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-surface-container-high rounded-full transition-colors" aria-label="Next month">
                                <span className="material-symbols-outlined text-on-surface">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </section>
                
                <div className="grid grid-cols-7 gap-2 mb-8">
                    <div className="text-center py-2 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Sun</div>
                    <div className="text-center py-2 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Mon</div>
                    <div className="text-center py-2 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Tue</div>
                    <div className="text-center py-2 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Wed</div>
                    <div className="text-center py-2 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Thu</div>
                    <div className="text-center py-2 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Fri</div>
                    <div className="text-center py-2 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Sat</div>
                    {calendarDays}
                </div>
                
                <section className="mt-8 grid md:grid-cols-2 gap-6">
                    <div className="bg-surface-container-low rounded-lg p-6">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary">
                                <span className="material-symbols-outlined">event_note</span>
                            </div>
                            <div>
                                <h3 className="font-manrope font-bold text-lg leading-tight">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                                {todayHijriParts ? (
                                    <p className="text-on-surface-variant text-sm">{todayHijriParts.day} {todayHijriParts.month} {todayHijriParts.year}</p>
                                ): (
                                     <p className="text-on-surface-variant text-sm">Loading Hijri date...</p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-lg">
                                <span className="text-on-surface-variant text-sm font-medium">Islamic Months</span>
                            </div>
                             <ul className="space-y-1 max-h-48 overflow-y-auto">
                                {islamicMonths.map((month, index) => (
                                    <li key={month} className={`flex items-center gap-4 p-2 rounded-lg ${todayHijriParts?.month === month ? 'bg-secondary-container/50' : ''}`}>
                                        <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${todayHijriParts?.month === month ? 'bg-primary text-on-primary' : 'bg-primary/10 text-primary'}`}>{index + 1}</span>
                                        <span className="font-medium">{month}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                     <div className="bg-surface-container-low rounded-lg p-6 flex flex-col justify-center overflow-hidden relative group">
                        <div className="relative z-10">
                            <h3 className="font-manrope font-bold text-lg mb-2">About Hijri Calendar</h3>
                            <p className="text-sm text-on-surface-variant">
                                The Islamic calendar, or Hijri calendar, is a lunar calendar consisting of 12 months in a year of 354 or 355 days. It is used to date events in many Muslim countries and is used by Muslims everywhere to determine the proper days on which to observe the annual fast of Ramadan, to attend Hajj, and to celebrate other Islamic holidays and festivals.
                            </p>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/5 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
                    </div>
                </section>
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
