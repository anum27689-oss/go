
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
import { useTranslation } from '@/hooks/use-translation';
import { UserAvatar } from '@/components/auth/UserAvatar';

type Prayer = {
    name: string;
    time: string;
};

type PrayerData = {
    timings: { [key: string]: string };
    date: { readable: string };
};

const prayerNameKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const parseTimeToDate = (timeStr: string, date: Date = new Date()) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};

export default function PrayerTimesPage() {
    const router = useRouter();
    const { t, language } = useTranslation();

    const prayerNames = useMemo(() => [
        { key: 'Fajr', name: t('prayer.fajr'), description: t('prayer.dawn'), icon: 'wb_sunny' },
        { key: 'Dhuhr', name: t('prayer.dhuhr'), description: t('prayer.noon'), icon: 'sunny' },
        { key: 'Asr', name: t('prayer.asr'), description: t('prayer.afternoon'), icon: 'wb_twilight' },
        { key: 'Maghrib', name: t('prayer.maghrib'), description: t('prayer.sunset'), icon: 'clear_night' },
        { key: 'Isha', name: t('prayer.isha'), description: t('prayer.night'), icon: 'bedtime' },
    ], [t]);

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
            
            const nextPrayerName = prayerNames.find(p => p.key === nextPrayer.name)?.name || nextPrayer.name;

            if (nextPrayerInfo.name !== nextPrayerName || nextPrayerInfo.minutesUntil !== minutesUntil) {
                setNextPrayerInfo({
                    name: nextPrayerName,
                    minutesUntil: minutesUntil,
                    time: nextPrayer.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12h' })
                });

                if (minutesUntil === 0 && notificationsEnabled && notificationPermission === 'granted') {
                    playAdhan();
                }
            }
        };

        const interval = setInterval(calculateNextPrayer, 1000);
        return () => clearInterval(interval);

    }, [prayerTimes, nextPrayerInfo, notificationsEnabled, notificationPermission, timeFormat, prayerNames]);
    
    const fetchPrayerTimes = async (lat: number, lng: number) => {
        setIsLoading(true);
        try {
            const date = new Date();
            const dateString = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            const url = `https://api.aladhan.com/v1/timings/${dateString}?latitude=${lat}&longitude=${lng}&method=${calculationMethod}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(t('prayer.error'));
            
            const data: { data: PrayerData } = await response.json();
            const timings = data.data.timings;
            
            localStorage.setItem(`prayerTimes_${lat}_${lng}`, JSON.stringify(timings));

            const mappedPrayers = prayerNameKeys.map(p => ({
                name: p,
                time: timings[p]
            }));

            setPrayerTimes(mappedPrayers);
            
            // Schedule notifications if enabled
            const adhanEnabled = localStorage.getItem('adhanNotifications') === 'true';
            const perm = 'Notification' in window ? Notification.permission : 'denied';

            if (adhanEnabled && perm === 'granted') {
                const prayerDates = prayerNameKeys.map(p => {
                    const prayerInfo = prayerNames.find(pi => pi.key === p);
                    return {
                        name: prayerInfo?.name || p,
                        date: parseTimeToDate(timings[p]).toISOString()
                    }
                });

                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        type: 'SCHEDULE_PRAYERS',
                        payload: {
                            prayers: prayerDates,
                            translations: {
                                title: t('prayer.notificationTitle'),
                            }
                        }
                    });
                }
            }

        } catch (error) {
            console.error("Error fetching prayer times:", error);
            const cachedTimings = localStorage.getItem(`prayerTimes_${lat}_${lng}`);
            if (cachedTimings) {
                const timings = JSON.parse(cachedTimings);
                const mappedPrayers = prayerNameKeys.map(p => ({
                    name: p,
                    time: timings[p]
                }));
                setPrayerTimes(mappedPrayers);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGeoLocation = () => {
        if (!navigator.geolocation) {
            alert(t('prayer.geoError'));
            return;
        }
        setIsGpsLoading(true);
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
             const city: City = { city: t('prayer.location'), lat: latitude, lng: longitude, country: "...", admin_name: "" };
             setSelectedCity(city);
             setIsGpsLoading(false);
        }, () => {
            alert(t('prayer.geoPermissionError'));
            setIsGpsLoading(false);
        });
    };

    const handleNotificationToggle = async (checked: boolean) => {
        localStorage.setItem('adhanNotifications', String(checked));
        setNotificationsEnabled(checked);

        if (checked) {
            if ('Notification' in window) {
                let permission = Notification.permission;
                if (permission === 'default') {
                    permission = await Notification.requestPermission();
                }
                setNotificationPermission(permission);

                if (permission === 'granted') {
                    // Force a refetch and reschedule of prayer times
                    if(selectedCity) {
                       fetchPrayerTimes(selectedCity.lat, selectedCity.lng);
                    }
                } else {
                    localStorage.setItem('adhanNotifications', 'false');
                    setNotificationsEnabled(false);
                    alert(t('settings.toast.permissionDeniedDesc'));
                }
            }
        } else {
            // When toggled off, cancel all scheduled notifications
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: 'CANCEL_PRAYERS' });
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
    }, [prayerTimes, timeFormat, prayerNames]);

    return (
        <div className="bg-surface font-body text-on-surface antialiased">
            <audio ref={audioRef} src="/adhan.mp3" preload="auto"></audio>
            <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 max-w-2xl mx-auto left-0 right-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                        <span className="material-symbols-outlined text-on-surface">arrow_back</span>
                    </button>
                    <Link href="/home" className="text-primary font-manrope font-extrabold tracking-tighter text-xl">{t('common.appName')}</Link>
                </div>
                 <div className="flex items-center gap-2">
                    <button className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                        <span className="material-symbols-outlined text-on-surface">brightness_3</span>
                    </button>
                </div>
            </header>

            <main className="pt-24 pb-28 px-6 max-w-2xl mx-auto min-h-screen">
                <section className={cn("mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 items-end", language === 'en' && 'mb-8')}>
                    <div className="flex flex-col gap-1">
                        <span className="text-label-md font-medium text-secondary tracking-widest uppercase opacity-80">{t('prayer.location')}</span>
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
                                            {selectedCity ? `${selectedCity.city}, ${selectedCity.admin_name}` : t('prayer.selectCity')}
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
                        {t('prayer.useMyLocation')}
                    </Button>
                </section>

                <section className={cn("mb-12 relative overflow-hidden rounded-lg bg-primary-container text-on-primary-container", language === 'en' ? "p-6 mb-10" : "p-8")}>
                    {isLoading ? (
                         <div className="flex items-center justify-center h-24">
                            <Loader2 className="h-8 w-8 animate-spin text-on-primary-container" />
                        </div>
                    ) : (
                        <div className="relative z-10">
                            <p className={cn("font-label text-label-md uppercase mb-2 opacity-90", language === 'en' ? "tracking-widest" : "tracking-[0.2em]")}>{t('prayer.upNext')}</p>
                            <h2 className={cn("font-headline font-extrabold text-4xl mb-1 leading-none", language === 'en' && 'text-3xl')}>{nextPrayerInfo.name}</h2>
                            <p className={cn("font-body text-xl font-medium opacity-80", language === 'en' && 'text-base')}>
                                {nextPrayerInfo.minutesUntil > 0 ? t('prayer.inMinutes').replace('{minutes}', String(nextPrayerInfo.minutesUntil)) : (nextPrayerInfo.minutesUntil === 0 ? t('prayer.now') : '...')}
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
                            const isActive = nextPrayerInfo.name === prayer.name;
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
                        <span className="font-headline font-bold text-on-surface">{t('prayer.adhan')}</span>
                    </div>
                    <Switch checked={notificationsEnabled} onCheckedChange={handleNotificationToggle} />
                </div>
            </main>

             <nav className="fixed bottom-0 w-full z-50 bg-surface/80 backdrop-blur-2xl flex justify-around items-center h-20 px-2 max-w-2xl mx-auto left-0 right-0 pb-[env(safe-area-inset-bottom)]">
                <Link href="/home" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant rounded-xl p-2 h-14 w-16 transition-all duration-200 active:scale-90 tap-highlight-none hover:bg-surface-container-high">
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-xs font-medium">{t('nav.home')}</span>
                </Link>
                <Link href="/prayer-times" className="flex flex-col items-center justify-center gap-1 bg-primary text-on-primary rounded-xl p-2 h-14 w-16 transition-all duration-200 active:scale-90 tap-highlight-none">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                    <span className="text-xs font-bold">{t('nav.prayer')}</span>
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
        </div>
    );
}
