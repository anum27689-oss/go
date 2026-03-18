"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';

const prayerTimesData: { [city: string]: { [prayer: string]: string } } = {
    'New York': { Fajr: '04:30 AM', Dhuhr: '01:00 PM', Asr: '04:45 PM', Maghrib: '07:30 PM', Isha: '09:00 PM' },
    'London': { Fajr: '03:45 AM', Dhuhr: '12:50 PM', Asr: '05:30 PM', Maghrib: '08:45 PM', Isha: '10:15 PM' },
    'Makkah': { Fajr: '04:50 AM', Dhuhr: '12:25 PM', Asr: '03:50 PM', Maghrib: '06:40 PM', Isha: '08:10 PM' },
    'Jakarta': { Fajr: '04:40 AM', Dhuhr: '12:00 PM', Asr: '03:25 PM', Maghrib: '06:00 PM', Isha: '07:15 PM' },
    'Cairo': { Fajr: '03:50 AM', Dhuhr: '12:05 PM', Asr: '03:40 PM', Maghrib: '06:50 PM', Isha: '08:20 PM' },
    'Istanbul': { Fajr: '04:30 AM', Dhuhr: '01:10 PM', Asr: '05:00 PM', Maghrib: '08:10 PM', Isha: '09:40 PM' },
    'Moscow': { Fajr: '02:30 AM', Dhuhr: '12:30 PM', Asr: '05:00 PM', Maghrib: '08:50 PM', Isha: '10:50 PM' },
    'Beijing': { Fajr: '04:00 AM', Dhuhr: '12:20 PM', Asr: '03:50 PM', Maghrib: '07:10 PM', Isha: '08:30 PM' },
    'Sydney': { Fajr: '05:30 AM', Dhuhr: '12:00 PM', Asr: '02:45 PM', Maghrib: '05:15 PM', Isha: '06:45 PM' },
    'Toronto': { Fajr: '05:00 AM', Dhuhr: '01:20 PM', Asr: '05:10 PM', Maghrib: '08:00 PM', Isha: '09:30 PM' },
    'São Paulo': { Fajr: '05:10 AM', Dhuhr: '12:15 PM', Asr: '03:30 PM', Maghrib: '05:50 PM', Isha: '07:10 PM' },
    'Dubai': { Fajr: '04:45 AM', Dhuhr: '12:20 PM', Asr: '03:45 PM', Maghrib: '07:00 PM', Isha: '08:30 PM' },
    'Kuala Lumpur': { Fajr: '05:50 AM', Dhuhr: '01:15 PM', Asr: '04:30 PM', Maghrib: '07:20 PM', Isha: '08:35 PM' },
    'Karachi': { Fajr: '04:55 AM', Dhuhr: '12:35 PM', Asr: '04:00 PM', Maghrib: '07:05 PM', Isha: '08:35 PM' },
    'Dhaka': { Fajr: '04:30 AM', Dhuhr: '12:05 PM', Asr: '03:20 PM', Maghrib: '06:20 PM', Isha: '07:45 PM' },
};

const prayers = [
    { name: 'Fajr', description: 'Dawn Prayer', icon: 'wb_sunny' },
    { name: 'Dhuhr', description: 'Noon Prayer', icon: 'sunny' },
    { name: 'Asr', description: 'Afternoon Prayer', icon: 'wb_twilight' },
    { name: 'Maghrib', description: 'Sunset Prayer', icon: 'clear_night' },
    { name: 'Isha', description: 'Night Prayer', icon: 'bedtime' },
];

const parseTime = (timeStr: string): Date => {
    const now = new Date();
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    const date = new Date(now);
    date.setHours(hours, minutes, 0, 0);
    return date;
};

export default function PrayerTimesPage() {
    const router = useRouter();
    const [selectedCity, setSelectedCity] = useState('London');
    const [nextPrayerInfo, setNextPrayerInfo] = useState({ name: '', minutesUntil: 0 });

    useEffect(() => {
        const calculateNextPrayer = () => {
            const now = new Date();
            const cityPrayerTimes = prayerTimesData[selectedCity];
            
            let nextPrayerDetails = null;
            let nextPrayerTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // a day from now

            for (const prayer of prayers) {
                const prayerTime = parseTime(cityPrayerTimes[prayer.name]);
                if (prayerTime > now && prayerTime < nextPrayerTime) {
                    nextPrayerTime = prayerTime;
                    nextPrayerDetails = prayer;
                }
            }

            if (!nextPrayerDetails) {
                nextPrayerDetails = prayers[0]; // Fajr next day
                nextPrayerTime = parseTime(cityPrayerTimes[nextPrayerDetails.name]);
                nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
            }
            
            const minutesUntil = Math.max(0, Math.round((nextPrayerTime.getTime() - now.getTime()) / (1000 * 60)));
            
            setNextPrayerInfo({
                name: nextPrayerDetails!.name,
                minutesUntil: minutesUntil
            });
        };

        calculateNextPrayer();
        const interval = setInterval(calculateNextPrayer, 30000);

        return () => clearInterval(interval);
    }, [selectedCity]);
    
    const cityPrayerTimes = prayerTimesData[selectedCity];

    return (
        <div className="bg-surface font-body text-on-surface antialiased">
            <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 max-w-2xl mx-auto left-0 right-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                        <span className="material-symbols-outlined text-on-surface">arrow_back</span>
                    </button>
                    <Link href="/home" className="text-primary font-manrope font-extrabold tracking-tighter text-xl">Islamic Companion</Link>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                        <span className="material-symbols-outlined text-on-surface">brightness_3</span>
                    </button>
                    <button className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                        <span className="material-symbols-outlined text-on-surface">account_circle</span>
                    </button>
                </div>
            </header>

            <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto min-h-screen">
                <section className="mb-10">
                    <div className="flex flex-col gap-1">
                        <span className="text-label-md font-medium text-secondary tracking-widest uppercase opacity-80">Current Location</span>
                        <div className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-lg shadow-sm group cursor-pointer active:scale-[0.98] transition-all">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                <span className="font-headline font-bold text-lg">{selectedCity}</span>
                            </div>
                             <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-y-0.5 transition-transform">expand_more</span>
                        </div>
                    </div>
                </section>

                <section className="mb-12 relative overflow-hidden rounded-lg bg-primary-container p-8 text-on-primary-container">
                    <div className="relative z-10">
                        <p className="font-label text-label-md uppercase tracking-[0.2em] mb-2 opacity-90">Up Next</p>
                        <h2 className="font-headline font-extrabold text-4xl mb-1 leading-none">{nextPrayerInfo.name}</h2>
                        <p className="font-body text-xl font-medium opacity-80">
                            {nextPrayerInfo.minutesUntil > 0 ? `in ${nextPrayerInfo.minutesUntil} minutes` : 'Now'}
                        </p>
                    </div>
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl"></div>
                     <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-[120px] opacity-10 pointer-events-none">wb_twilight</span>
                </section>
                
                <div className="space-y-4">
                    {prayers.map(prayer => {
                        const time = cityPrayerTimes[prayer.name];
                        const [hour, minutePeriod] = time.split(':');
                        const [minute, period] = minutePeriod.split(' ');
                        const isActive = nextPrayerInfo.name === prayer.name;

                        return (
                            <div key={prayer.name} className={`relative overflow-hidden p-5 rounded-lg flex items-center justify-between transition-all group ${isActive ? 'bg-primary text-on-primary shadow-xl shadow-primary/10 ring-2 ring-primary' : 'bg-surface-container-lowest hover:bg-surface-container-low'}`}>
                                <div className="flex items-center gap-5 z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-on-primary/10' : 'bg-surface-container'}`}>
                                        <span className={`material-symbols-outlined ${isActive ? 'text-on-primary active-icon' : 'text-secondary'}`} style={isActive ? {fontVariationSettings: "'FILL' 1"} : {}}>{prayer.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className={`font-headline font-bold text-lg ${isActive ? 'text-on-primary' : 'text-on-surface'}`}>{prayer.name}</h3>
                                        <p className={`text-sm ${isActive ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>{prayer.description}</p>
                                    </div>
                                </div>
                                <div className="text-right z-10">
                                    <span className={`font-headline font-extrabold text-lg ${isActive ? 'text-on-primary' : 'text-on-surface'}`}>{`${hour}:${minute}`}</span>
                                    <p className={`text-xs ${isActive ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>{period}</p>
                                </div>
                                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container"></div>}
                            </div>
                        )
                    })}
                </div>

                <div className="mt-12 p-6 rounded-lg bg-surface-container-high flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary">notifications_active</span>
                        <span className="font-headline font-bold text-on-surface">Adhan Notifications</span>
                    </div>
                    <Switch defaultChecked />
                </div>
            </main>

            <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/80 backdrop-blur-2xl flex justify-around items-center h-20 px-4 max-w-2xl mx-auto left-0 right-0">
                <Link href="/home" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 tap-highlight-none active:scale-90 transition-transform">
                    <span className="material-symbols-outlined">home</span>
                    <span className="font-label text-sm font-medium tracking-wide">Home</span>
                </Link>
                <Link href="/prayer-times" className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-5 py-1.5 transition-all tap-highlight-none active:scale-90">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                    <span className="font-label text-sm font-medium tracking-wide">Prayer</span>
                </Link>
                <Link href="/tasbeeh" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 tap-highlight-none active:scale-90 transition-transform">
                    <span className="material-symbols-outlined">adjust</span>
                    <span className="font-label text-sm font-medium tracking-wide">Tasbeeh</span>
                </Link>
                <Link href="#" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 tap-highlight-none active:scale-90 transition-transform">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="font-label text-sm font-medium tracking-wide">Settings</span>
                </Link>
            </nav>
        </div>
    );
}
