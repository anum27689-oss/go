
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { pakistanCities, type City } from '@/lib/pakistan-cities';

type Prayer = {
    name: string;
    time: string;
};

type PrayerData = {
    timings: { [key: string]: string };
    date: { readable: string };
};

const prayerNames = [
    { key: 'Fajr', name: 'Fajr', description: 'Dawn Prayer', icon: 'wb_sunny' },
    { key: 'Dhuhr', name: 'Dhuhr', description: 'Noon Prayer', icon: 'sunny' },
    { key: 'Asr', name: 'Asr', description: 'Afternoon Prayer', icon: 'wb_twilight' },
    { key: 'Maghrib', name: 'Maghrib', description: 'Sunset Prayer', icon: 'clear_night' },
    { key: 'Isha', name: 'Isha', description: 'Night Prayer', icon: 'bedtime' },
];

const parseTimeToDate = (timeStr: string, date: Date = new Date()) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};

export default function PrayerTimesPage() {
    const router = useRouter();
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [prayerTimes, setPrayerTimes] = useState<Prayer[]>([]);
    const [nextPrayerInfo, setNextPrayerInfo] = useState({ name: '', minutesUntil: -1, time: '' });
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [isLoading, setIsLoading] = useState(true);
    const [isGpsLoading, setIsGpsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const [calculationMethod, setCalculationMethod] = useState('2'); // Default: ISNA
    const [timeFormat, setTimeFormat] = useState('12h');

    useEffect(() => {
        const savedMethod = localStorage.getItem('prayerCalculationMethod') || '2';
        const savedTimeFormat = localStorage.getItem('prayerTimeFormat') || '12h';
        setCalculationMethod(savedMethod);
        setTimeFormat(savedTimeFormat);
        
        const savedCityJSON = localStorage.getItem('selectedCity');
        if (savedCityJSON) {
            try {
                const savedCity = JSON.parse(savedCityJSON);
                if (typeof savedCity === 'object' && savedCity !== null && 'lat' in savedCity && 'lng' in savedCity) {
                    setSelectedCity(savedCity);
                } else {
                    setSelectedCity(pakistanCities.find(c => c.city === "Karachi") || null);
                }
            } catch (e) {
                console.error("Failed to parse saved city, defaulting to Karachi:", e);
                setSelectedCity(pakistanCities.find(c => c.city === "Karachi") || null);
            }
        } else {
            setSelectedCity(pakistanCities.find(c => c.city === "Karachi") || null);
        }

        const adhanSetting = localStorage.getItem('adhanNotifications') === 'true';
        setNotificationsEnabled(adhanSetting);
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    useEffect(() => {
        if (selectedCity) {
            localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
            fetchPrayerTimes(selectedCity.lat, selectedCity.lng);
        }
    }, [selectedCity, calculationMethod]);

    useEffect(() => {
        const calculateNextPrayer = () => {
            if (prayerTimes.length === 0) return;

            const now = new Date();
            const sortedPrayers = prayerTimes
                .map(p => ({
                    name: p.name,
                    time: parseTimeToDate(p.time, now)
                }))
                .sort((a, b) => a.time.getTime() - b.time.getTime());

            let nextPrayer = sortedPrayers.find(p => p.time > now);
            let isTomorrow = false;

            if (!nextPrayer) {
                isTomorrow = true;
                nextPrayer = sortedPrayers[0];
            }
            
            const nextPrayerTime = new Date(nextPrayer.time);
            if (isTomorrow) {
                nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
            }
            
            const minutesUntil = Math.max(0, Math.round((nextPrayerTime.getTime() - now.getTime()) / (1000 * 60)));
            
            if (nextPrayerInfo.name !== nextPrayer.name || nextPrayerInfo.minutesUntil !== minutesUntil) {
                setNextPrayerInfo({
                    name: nextPrayer.name,
                    minutesUntil: minutesUntil,
                    time: nextPrayer.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12h' })
                });

                if (minutesUntil === 0 && notificationsEnabled && notificationPermission === 'granted') {
                    playAdhan();
                    new Notification(`It's time for ${nextPrayer.name} prayer.`, {
                        body: `The time for ${nextPrayer.name} has begun.`,
                        icon: '/icon.png' 
                    });
                }
            }
        };

        const interval = setInterval(calculateNextPrayer, 1000);
        return () => clearInterval(interval);

    }, [prayerTimes, nextPrayerInfo, notificationsEnabled, notificationPermission, timeFormat]);
    
    const fetchPrayerTimes = async (lat: number, lng: number) => {
        setIsLoading(true);
        try {
            const date = new Date();
            const dateString = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            const url = `https://api.aladhan.com/v1/timings/${dateString}?latitude=${lat}&longitude=${lng}&method=${calculationMethod}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch prayer times');
            
            const data: { data: PrayerData } = await response.json();
            const timings = data.data.timings;
            
            localStorage.setItem(`prayerTimes_${lat}_${lng}`, JSON.stringify(timings));

            const mappedPrayers = prayerNames.map(p => ({
                name: p.key,
                time: timings[p.key]
            }));

            setPrayerTimes(mappedPrayers);
        } catch (error) {
            console.error("Error fetching prayer times:", error);
            const cachedTimings = localStorage.getItem(`prayerTimes_${lat}_${lng}`);
            if (cachedTimings) {
                const timings = JSON.parse(cachedTimings);
                const mappedPrayers = prayerNames.map(p => ({
                    name: p.key,
                    time: timings[p.key]
                }));
                setPrayerTimes(mappedPrayers);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGeoLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        setIsGpsLoading(true);
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
             const city: City = { city: "Current Location", lat: latitude, lng: longitude, country: "...", admin_name: "" };
             setSelectedCity(city);
             setIsGpsLoading(false);
        }, () => {
            alert('Unable to retrieve your location. Please enable location services.');
            setIsGpsLoading(false);
        });
    };

    const handleNotificationToggle = async (checked: boolean) => {
        setNotificationsEnabled(checked);
        localStorage.setItem('adhanNotifications', String(checked));

        if (checked && 'Notification' in window) {
            if (notificationPermission !== 'granted') {
                const permission = await Notification.requestPermission();
                setNotificationPermission(permission);
                if (permission !== 'granted') {
                    setNotificationsEnabled(false);
                    localStorage.setItem('adhanNotifications', 'false');
                    alert("You have disabled notifications. Please enable them in your browser settings to receive Azan alerts.");
                }
            }
        }
    };
    
    const playAdhan = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(error => console.error("Audio play failed:", error));
        }
    };


    const formattedPrayerTimes = useMemo(() => {
        return prayerNames.map(prayerInfo => {
            const prayer = prayerTimes.find(p => p.name === prayerInfo.key);
            let time = prayer?.time || '...';

            if (time !== '...' && timeFormat === '12h') {
                const [hours, minutes] = time.split(':');
                const h = parseInt(hours);
                const ampm = h >= 12 ? 'PM' : 'AM';
                const formattedHour = h % 12 || 12;
                time = `${String(formattedHour).padStart(2, '0')}:${minutes}`;
                 return { ...prayerInfo, time, period: ampm };
            }
             return { ...prayerInfo, time, period: '' };
        });
    }, [prayerTimes, timeFormat]);

    return (
        <div className="bg-surface font-body text-on-surface antialiased">
            <audio ref={audioRef} src="/adhan.mp3" preload="auto"></audio>
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
                <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div className="flex flex-col gap-1">
                        <span className="text-label-md font-medium text-secondary tracking-widest uppercase opacity-80">Current Location</span>
                         <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between bg-surface-container-lowest p-4 rounded-lg shadow-sm group cursor-pointer active:scale-[0.98] transition-all border-0 focus:ring-0 h-auto"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">location_on</span>
                                        <span className="font-headline font-bold text-lg text-left">
                                            {selectedCity ? `${selectedCity.city}, ${selectedCity.admin_name}` : "Select city..."}
                                        </span>
                                    </div>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search city..." />
                                    <CommandList>
                                        <CommandEmpty>No city found.</CommandEmpty>
                                        <CommandGroup>
                                            {pakistanCities.map((city) => (
                                                <CommandItem
                                                    key={`${city.city}-${city.admin_name}`}
                                                    value={`${city.city} ${city.admin_name}`}
                                                    onSelect={() => {
                                                        setSelectedCity(city);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedCity?.city === city.city && selectedCity?.admin_name === city.admin_name ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {city.city}, {city.admin_name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                     <Button onClick={handleGeoLocation} disabled={isGpsLoading} className="w-full md:w-auto">
                        {isGpsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="material-symbols-outlined mr-2">my_location</span>}
                        Use my location
                    </Button>
                </section>

                <section className="mb-12 relative overflow-hidden rounded-lg bg-primary-container p-8 text-on-primary-container">
                    {isLoading ? (
                         <div className="flex items-center justify-center h-24">
                            <Loader2 className="h-8 w-8 animate-spin text-on-primary-container" />
                        </div>
                    ) : (
                        <div className="relative z-10">
                            <p className="font-label text-label-md uppercase tracking-[0.2em] mb-2 opacity-90">Up Next</p>
                            <h2 className="font-headline font-extrabold text-4xl mb-1 leading-none">{nextPrayerInfo.name}</h2>
                            <p className="font-body text-xl font-medium opacity-80">
                                {nextPrayerInfo.minutesUntil > 0 ? `in ${nextPrayerInfo.minutesUntil} minutes` : (nextPrayerInfo.minutesUntil === 0 ? 'Now' : '...')}
                            </p>
                        </div>
                    )}
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl"></div>
                     <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-[120px] opacity-10 pointer-events-none">wb_twilight</span>
                </section>
                
                <div className="space-y-4">
                     {isLoading ? (
                        prayerNames.map(prayer => (
                             <div key={prayer.key} className="bg-surface-container-lowest p-5 rounded-lg flex items-center justify-between animate-pulse">
                               <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-full bg-surface-container"></div>
                                    <div>
                                        <div className="h-6 w-20 bg-surface-container rounded"></div>
                                        <div className="h-4 w-28 bg-surface-container rounded mt-1"></div>
                                    </div>
                                </div>
                                <div className="h-6 w-16 bg-surface-container rounded"></div>
                            </div>
                        ))
                    ) : (
                        formattedPrayerTimes.map(prayer => {
                            const isActive = nextPrayerInfo.name === prayer.key;
                            return (
                                <div key={prayer.key} className={`relative overflow-hidden p-5 rounded-lg flex items-center justify-between transition-all group ${isActive ? 'bg-primary text-on-primary shadow-xl shadow-primary/10 ring-2 ring-primary' : 'bg-surface-container-lowest hover:bg-surface-container-low'}`}>
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
                                        <span className={`font-headline font-extrabold text-lg ${isActive ? 'text-on-primary' : 'text-on-surface'}`}>{prayer.time}</span>
                                        {prayer.period && <p className={`text-xs ${isActive ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>{prayer.period}</p>}
                                    </div>
                                    {isActive && <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container"></div>}
                                </div>
                            )
                        })
                    )}
                </div>

                <div className="mt-12 p-6 rounded-lg bg-surface-container-high flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary">notifications_active</span>
                        <span className="font-headline font-bold text-on-surface">Adhan Notifications</span>
                    </div>
                    <Switch checked={notificationsEnabled} onCheckedChange={handleNotificationToggle} />
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
                <Link href="/qibla" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90">
                    <span className="material-symbols-outlined">explore</span>
                    <span className="font-label text-sm font-medium tracking-wide">Qibla</span>
                </Link>
                <Link href="/tasbeeh" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 tap-highlight-none active:scale-90 transition-transform">
                    <span className="material-symbols-outlined">adjust</span>
                    <span className="font-label text-sm font-medium tracking-wide">Tasbeeh</span>
                </Link>
                <Link href="/settings" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 tap-highlight-none active:scale-90 transition-transform">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="font-label text-sm font-medium tracking-wide">Settings</span>
                </Link>
            </nav>
        </div>
    );
}

    