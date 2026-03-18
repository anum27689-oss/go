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
                    <Link href="/home" className="text-primary font-manrope font-extrabold tracking-tighter text-xl">Islamic Companion</Link>
                </div>
                 <button className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                    <span className="material-symbols-outlined text-on-surface">account_circle</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
                <h1 className="font-headline font-extrabold text-4xl text-on-surface mb-10 tracking-tight">Settings</h1>

                {/* Appearance Settings */}
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">Appearance</h2>
                    <div className="bg-surface-container-lowest rounded-lg divide-y divide-outline-variant/20">
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <span className="material-symbols-outlined text-on-surface-variant">palette</span>
                                <span className="font-headline font-medium">Theme</span>
                            </div>
                            <div className="flex items-center gap-2 bg-surface-container p-1 rounded-full">
                                <button onClick={() => setTheme('light')} className={`px-4 py-1.5 text-sm font-bold rounded-full transition-colors ${theme === 'light' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>Light</button>
                                <button onClick={() => setTheme('dark')} className={`px-4 py-1.5 text-sm font-bold rounded-full transition-colors ${theme === 'dark' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>Dark</button>
                                <button onClick={() => setTheme('system')} className={`px-4 py-1.5 text-sm font-bold rounded-full transition-colors ${theme === 'system' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>System</button>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Prayer Time Settings */}
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">Prayer Times</h2>
                    <div className="bg-surface-container-lowest rounded-lg divide-y divide-outline-variant/20">
                         <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <span className="material-symbols-outlined text-on-surface-variant">calculate</span>
                                    <Label className="font-headline font-medium" htmlFor="calculation-method">Calculation Method</Label>
                                </div>
                                <Select onValueChange={handleMethodChange} value={calculationMethod}>
                                    <SelectTrigger id="calculation-method" className="w-[180px] bg-surface-container">
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
                                <div className="flex items-center gap-5">
                                    <span className="material-symbols-outlined text-on-surface-variant">schedule</span>
                                    <Label className="font-headline font-medium">Time Format</Label>
                                </div>
                                <RadioGroup value={timeFormat} onValueChange={handleTimeFormatChange} className="flex gap-2 bg-surface-container p-1 rounded-full">
                                    <Label htmlFor="12h" className={`px-4 py-1.5 text-sm font-bold rounded-full transition-colors cursor-pointer ${timeFormat === '12h' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>
                                        <RadioGroupItem value="12h" id="12h" className="sr-only" />
                                        12-hour
                                    </Label>
                                    <Label htmlFor="24h" className={`px-4 py-1.5 text-sm font-bold rounded-full transition-colors cursor-pointer ${timeFormat === '24h' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>
                                        <RadioGroupItem value="24h" id="24h" className="sr-only" />
                                        24-hour
                                    </Label>
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <span className="material-symbols-outlined text-on-surface-variant">notifications_active</span>
                                <span className="font-headline font-medium">Adhan Notifications</span>
                            </div>
                            <Switch checked={notificationsEnabled} onCheckedChange={handleNotificationToggle} />
                        </div>
                    </div>
                </section>

                {/* About Section */}
                 <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">About & Support</h2>
                    <div className="bg-surface-container-lowest rounded-lg divide-y divide-outline-variant/20">
                        <Link href="/privacy-policy" className="p-5 flex items-center justify-between hover:bg-surface-container transition-colors">
                            <div className="flex items-center gap-5">
                                <span className="material-symbols-outlined text-on-surface-variant">policy</span>
                                <span className="font-headline font-medium">Privacy Policy</span>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                        </Link>
                         <div className="p-5 flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer">
                            <div className="flex items-center gap-5">
                                <span className="material-symbols-outlined text-on-surface-variant">share</span>
                                <span className="font-headline font-medium">Share App</span>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                        </div>
                         <div className="p-5 flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer">
                            <div className="flex items-center gap-5">
                                <span className="material-symbols-outlined text-on-surface-variant">star</span>
                                <span className="font-headline font-medium">Rate on App Store</span>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                        </div>
                    </div>
                </section>
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
