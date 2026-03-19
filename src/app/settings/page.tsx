
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
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';

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
    const { t, language, setLanguage } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [calculationMethod, setCalculationMethod] = useState('2');
    const [timeFormat, setTimeFormat] = useState('12h');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const { toast } = useToast();

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
         toast({ title: t('settings.toast.settingsSaved'), description: t('settings.toast.calcMethodUpdated') });
    };

    const handleTimeFormatChange = (value: string) => {
        setTimeFormat(value);
        localStorage.setItem('prayerTimeFormat', value);
        toast({ title: t('settings.toast.settingsSaved'), description: t('settings.toast.timeFormatUpdated') });
    };
    
    const handleLanguageChange = (lang: 'en' | 'ur') => {
        setLanguage(lang);
    };

    const handleNotificationToggle = async (checked: boolean) => {
        setNotificationsEnabled(checked);
        localStorage.setItem('adhanNotifications', String(checked));

        if (checked && 'Notification' in window && Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                setNotificationsEnabled(false);
                localStorage.setItem('adhanNotifications', 'false');
                toast({
                    variant: "destructive",
                    title: t('settings.toast.permissionDenied'),
                    description: t('settings.toast.permissionDeniedDesc')
                });
            } else {
                 toast({ title: t('settings.toast.notificationsEnabled'), description: t('settings.toast.notificationsEnabledDesc') });
            }
        } else {
            toast({ title: t('settings.toast.settingsSaved'), description: t(checked ? 'settings.toast.notificationsEnabled' : 'settings.toast.notificationsDisabled') });
        }
    };
    
    const handleRateApp = () => {
        window.open('https://play.google.com/store/apps/details?id=com.islamicdailycompanion.app', '_blank');
    };
    
    if (!mounted) {
        return null; // Avoid hydration mismatch
    }

    return (
        <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
            <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 max-w-2xl mx-auto left-0 right-0">
                <div className="flex items-center gap-4">
                     <button onClick={() => router.back()} className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                        <span className="material-symbols-outlined text-on-surface">arrow_back</span>
                    </button>
                    <Link href="/home">
                        <h1 className="font-manrope font-bold text-xl tracking-tight text-primary">{t('common.appName')}</h1>
                    </Link>
                </div>
                 <button className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                    <span className="material-symbols-outlined text-on-surface">account_circle</span>
                </button>
            </header>

            <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-8">
                 <section className="bg-surface-container-low p-6 rounded-lg flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                        <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
                    </div>
                    <div>
                        <h2 className="font-headline font-bold text-xl tracking-tight">{t('settings.greeting').replace('{name}', t('common.guest'))}</h2>
                        <p className="text-on-surface-variant text-sm font-medium">{t('settings.subtitle')}</p>
                    </div>
                </section>
                
                <section className="space-y-4">
                    <h3 className="text-secondary font-headline font-bold text-sm uppercase tracking-widest px-2">{t('settings.general')}</h3>
                    <div className="bg-surface-container-lowest rounded-lg overflow-hidden divide-y divide-outline-variant/10">
                        <div className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">language</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-on-surface">{t('settings.language')}</p>
                                    <p className="text-xs text-on-surface-variant font-medium">{t('settings.currentLanguage').replace('{lang}', language === 'en' ? t('settings.english') : t('settings.urdu'))}</p>
                                </div>
                            </div>
                            <div className="flex bg-surface-container p-1 rounded-full">
                                <button onClick={() => handleLanguageChange('en')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${language === 'en' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>{t('settings.english')}</button>
                                <button onClick={() => handleLanguageChange('ur')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${language === 'ur' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>{t('settings.urdu')}</button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">dark_mode</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-on-surface">{t('settings.theme')}</p>
                                    <p className="text-xs text-on-surface-variant font-medium capitalize">{theme === 'system' ? t('settings.themeSystem') : t(theme === 'light' ? 'settings.themeLight' : 'settings.themeDark')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-surface-container p-1 rounded-full">
                                <button onClick={() => setTheme('light')} className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${theme === 'light' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>{t('settings.themeLight')}</button>
                                <button onClick={() => setTheme('dark')} className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${theme === 'dark' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>{t('settings.themeDark')}</button>
                                <button onClick={() => setTheme('system')} className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${theme === 'system' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>{t('settings.themeSystem')}</button>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="space-y-4">
                    <h3 className="text-secondary font-headline font-bold text-sm uppercase tracking-widest px-2">{t('settings.prayerPrefs')}</h3>
                    <div className="bg-surface-container-lowest rounded-lg divide-y divide-outline-variant/10">
                         <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                        <span className="material-symbols-outlined">calculate</span>
                                    </div>
                                    <Label className="font-semibold text-on-surface" htmlFor="calculation-method">{t('settings.calcMethod')}</Label>
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
                                    <Label className="font-semibold text-on-surface">{t('settings.timeFormat')}</Label>
                                </div>
                                <RadioGroup value={timeFormat} onValueChange={handleTimeFormatChange} className="flex gap-1 bg-surface-container p-1 rounded-full">
                                    <Label htmlFor="12h" className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${timeFormat === '12h' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>
                                        <RadioGroupItem value="12h" id="12h" className="sr-only" />
                                        {t('settings.time12')}
                                    </Label>
                                    <Label htmlFor="24h" className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${timeFormat === '24h' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>
                                        <RadioGroupItem value="24h" id="24h" className="sr-only" />
                                        {t('settings.time24')}
                                    </Label>
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">notifications_active</span>
                                </div>
                                <span className="font-semibold text-on-surface">{t('settings.adhan')}</span>
                            </div>
                            <Switch checked={notificationsEnabled} onCheckedChange={handleNotificationToggle} />
                        </div>
                    </div>
                </section>

                 <section className="space-y-4">
                    <h3 className="text-secondary font-headline font-bold text-sm uppercase tracking-widest px-2">{t('settings.support')}</h3>
                    <div className="bg-surface-container-lowest rounded-lg divide-y divide-outline-variant/10">
                        <Link href="/privacy-policy" className="w-full flex items-center justify-between p-5 hover:bg-surface-container-high transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">policy</span>
                                </div>
                                <p className="font-semibold text-on-surface text-left">{t('settings.privacy')}</p>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </Link>
                         <button onClick={handleRateApp} className="w-full flex items-center justify-between p-5 hover:bg-surface-container-high transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">star</span>
                                </div>
                                <p className="font-semibold text-on-surface text-left">{t('settings.rate')}</p>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </button>
                         <Link href="/about" className="w-full flex items-center justify-between p-5 hover:bg-surface-container-high transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">info</span>
                                </div>
                                <p className="font-semibold text-on-surface text-left">{t('settings.about')}</p>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </Link>
                    </div>
                </section>
                
                <div className="pt-8 text-center space-y-2">
                    <span className="material-symbols-outlined text-4xl text-primary">brightness_3</span>
                    <p className="font-manrope font-black tracking-tighter text-on-surface-variant">Version 2026 — v1.0.0</p>
                </div>
            </main>

            <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/80 backdrop-blur-2xl flex justify-around items-center h-20 px-4 max-w-2xl mx-auto left-0 right-0">
                <Link href="/home" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90">
                    <span className="material-symbols-outlined">home</span>
                    <span className="font-label text-sm font-medium tracking-wide">{t('nav.home')}</span>
                </Link>
                <Link href="/prayer-times" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90">
                    <span className="material-symbols-outlined">schedule</span>
                    <span className="font-label text-sm font-medium tracking-wide">{t('nav.prayer')}</span>
                </Link>
                <Link href="/tasbeeh" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90">
                    <span className="material-symbols-outlined">adjust</span>
                    <span className="font-label text-sm font-medium tracking-wide">{t('nav.tasbeeh')}</span>
                </Link>
                <Link href="/islamic-calendar" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90">
                    <span className="material-symbols-outlined">calendar_month</span>
                    <span className="font-label text-sm font-medium tracking-wide">{t('nav.calendar')}</span>
                </Link>
                <Link href="/settings" className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-5 py-1.5 transition-all active:scale-90">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
                    <span className="font-label text-sm font-medium tracking-wide">{t('nav.settings')}</span>
                </Link>
            </nav>
        </div>
    );
}
