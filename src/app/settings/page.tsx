
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const calculationMethods = [
    { value: '1', label: 'Jafari (Ithna Ashari)' },
    { value: '2', label: 'University of Islamic Sciences, Karachi' },
    { value: '3', label: 'Islamic Society of North America (ISNA)' },
    { value: '4', label: 'Muslim World League' },
    { value: '5', label: 'Umm Al-Qura University, Makkah' },
    { value: '7', label: 'Egyptian General Authority of Survey' },
    { value: '8', label: 'Institute of Geophysics, University of Tehran' },
    { value: '9', label: 'Gulf Region' },
    { value: '10', label: 'Kuwait' },
    { value: '11', label: 'Qatar' },
    { value: '12', label: 'Majlis Ugama Islam Singapura, Singapore' },
    { value: '13', label: 'Union Organization islamic de France' },
    { value: '14', label: 'Diyanet İşleri Başkanlığı, Turkey' },
    { value: '15', label: 'Spiritual Administration of Muslims of Russia' },
];

export default function SettingsPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [calculationMethod, setCalculationMethod] = useState('2');
    const [timeFormat, setTimeFormat] = useState('12h');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [language, setLanguage] = useState('en');


    useEffect(() => {
        setMounted(true);
        const savedMethod = localStorage.getItem('prayerCalculationMethod') || '2';
        setCalculationMethod(savedMethod);

        const savedFormat = localStorage.getItem('prayerTimeFormat') || '12h';
        setTimeFormat(savedFormat);

        const adhanSetting = localStorage.getItem('adhanNotifications') === 'true';
        setNotificationsEnabled(adhanSetting);
    }, []);

    const handleMethodChange = (value: string) => {
        setCalculationMethod(value);
        localStorage.setItem('prayerCalculationMethod', value);
    };

    const handleTimeFormatChange = (value: string) => {
        setTimeFormat(value);
        localStorage.setItem('prayerTimeFormat', value);
    };

    const handleNotificationToggle = async (checked: boolean) => {
        setNotificationsEnabled(checked);
        localStorage.setItem('adhanNotifications', String(checked));

        if (checked && 'Notification' in window && Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                setNotificationsEnabled(false);
                localStorage.setItem('adhanNotifications', 'false');
                alert("You have disabled notifications. Please enable them in your browser settings to receive Azan alerts.");
            }
        }
    };
    
    if (!mounted) {
        return null; // Avoid hydration mismatch
    }

    return (
        <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 max-w-2xl mx-auto left-0 right-0">
                <div className="flex items-center gap-4">
                     <button onClick={() => router.back()} className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                        <span className="material-symbols-outlined text-on-surface">arrow_back</span>
                    </button>
                    <Link href="/home">
                        <h1 className="font-manrope font-bold text-xl tracking-tight text-primary">Islamic Companion</h1>
                    </Link>
                </div>
                 <button className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                    <span className="material-symbols-outlined text-on-surface">account_circle</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-8">
                 <section className="bg-surface-container-low p-6 rounded-lg flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                        <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
                    </div>
                    <div>
                        <h2 className="font-headline font-bold text-xl tracking-tight">Assalamu Alaikum, Guest</h2>
                        <p className="text-on-surface-variant text-sm font-medium">Manage your spiritual preferences</p>
                    </div>
                </section>
                
                <section className="space-y-4">
                    <h3 className="text-secondary font-headline font-bold text-sm uppercase tracking-widest px-2">General Preferences</h3>
                    <div className="bg-surface-container-lowest rounded-lg overflow-hidden divide-y divide-outline-variant/10">
                        <div className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">language</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-on-surface">Language</p>
                                    <p className="text-xs text-on-surface-variant font-medium">Current: {language === 'en' ? 'English' : 'Urdu'}</p>
                                </div>
                            </div>
                            <div className="flex bg-surface-container p-1 rounded-full">
                                <button onClick={() => setLanguage('en')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${language === 'en' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>English</button>
                                <button onClick={() => setLanguage('ur')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${language === 'ur' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>Urdu</button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">dark_mode</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-on-surface">Theme</p>
                                    <p className="text-xs text-on-surface-variant font-medium capitalize">{theme === 'system' ? 'Automatic' : theme}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-surface-container p-1 rounded-full">
                                <button onClick={() => setTheme('light')} className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${theme === 'light' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>Light</button>
                                <button onClick={() => setTheme('dark')} className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${theme === 'dark' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>Dark</button>
                                <button onClick={() => setTheme('system')} className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${theme === 'system' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>System</button>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="space-y-4">
                    <h3 className="text-secondary font-headline font-bold text-sm uppercase tracking-widest px-2">Prayer Time Preferences</h3>
                    <div className="bg-surface-container-lowest rounded-lg divide-y divide-outline-variant/10">
                         <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                        <span className="material-symbols-outlined">calculate</span>
                                    </div>
                                    <Label className="font-semibold text-on-surface" htmlFor="calculation-method">Calculation Method</Label>
                                </div>
                                <Select onValueChange={handleMethodChange} value={calculationMethod}>
                                    <SelectTrigger id="calculation-method" className="w-auto md:w-[180px] bg-surface-container border-0">
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {calculationMethods.map(method => (
                                            <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                    <Label className="font-semibold text-on-surface">Time Format</Label>
                                </div>
                                <RadioGroup value={timeFormat} onValueChange={handleTimeFormatChange} className="flex gap-1 bg-surface-container p-1 rounded-full">
                                    <Label htmlFor="12h" className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${timeFormat === '12h' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>
                                        <RadioGroupItem value="12h" id="12h" className="sr-only" />
                                        12-hour
                                    </Label>
                                    <Label htmlFor="24h" className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${timeFormat === '24h' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>
                                        <RadioGroupItem value="24h" id="24h" className="sr-only" />
                                        24-hour
                                    </Label>
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">notifications_active</span>
                                </div>
                                <span className="font-semibold text-on-surface">Adhan Notifications</span>
                            </div>
                            <Switch checked={notificationsEnabled} onCheckedChange={handleNotificationToggle} />
                        </div>
                    </div>
                </section>

                 <section className="space-y-4">
                    <h3 className="text-secondary font-headline font-bold text-sm uppercase tracking-widest px-2">Support & Legal</h3>
                    <div className="bg-surface-container-lowest rounded-lg divide-y divide-outline-variant/10">
                        <Link href="/privacy-policy" className="w-full flex items-center justify-between p-5 hover:bg-surface-container-high transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">policy</span>
                                </div>
                                <p className="font-semibold text-on-surface text-left">Privacy Policy</p>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </Link>
                         <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container-high transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">star</span>
                                </div>
                                <p className="font-semibold text-on-surface text-left">Rate App</p>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </button>
                         <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container-high transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">info</span>
                                </div>
                                <p className="font-semibold text-on-surface text-left">About App</p>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </button>
                    </div>
                </section>
                
                <div className="pt-8 text-center space-y-2 opacity-40 grayscale pointer-events-none">
                    <span className="material-symbols-outlined text-4xl text-primary">brightness_3</span>
                    <p className="font-manrope font-black tracking-tighter text-on-surface-variant">VERSION 1.0.0 (2024)</p>
                </div>
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/80 backdrop-blur-2xl flex justify-around items-center h-20 px-4 max-w-2xl mx-auto left-0 right-0">
                <Link href="/home" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90">
                    <span className="material-symbols-outlined">home</span>
                    <span className="font-label text-sm font-medium tracking-wide">Home</span>
                </Link>
                <Link href="/prayer-times" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90">
                    <span className="material-symbols-outlined">schedule</span>
                    <span className="font-label text-sm font-medium tracking-wide">Prayer</span>
                </Link>
                <Link href="/tasbeeh" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90">
                    <span className="material-symbols-outlined">adjust</span>
                    <span className="font-label text-sm font-medium tracking-wide">Tasbeeh</span>
                </Link>
                <Link href="/islamic-calendar" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90">
                    <span className="material-symbols-outlined">calendar_month</span>
                    <span className="font-label text-sm font-medium tracking-wide">Calendar</span>
                </Link>
                <Link href="/settings" className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-5 py-1.5 transition-all active:scale-90">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
                    <span className="font-label text-sm font-medium tracking-wide">Settings</span>
                </Link>
            </nav>
        </div>
    );
}

    