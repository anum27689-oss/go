
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/use-translation';

export default function QiblaDirectionPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [direction, setDirection] = useState(0);
    const [qiblaDirection, setQiblaDirection] = useState(0);
    const [distance, setDistance] = useState(0);
    const [error, setError] = useState('');
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [open, setOpen] = useState(false);
    const [isGpsLoading, setIsGpsLoading] = useState(false);

    const KAABA_LAT = 21.4225;
    const KAABA_LNG = 39.8262;

    useEffect(() => {
        const savedCityJSON = localStorage.getItem('selectedCity');
        if (savedCityJSON) {
            try {
                const savedCity = JSON.parse(savedCityJSON);
                if (typeof savedCity === 'object' && savedCity !== null && 'lat' in savedCity && 'lng' in savedCity) {
                    setSelectedCity(savedCity);
                } else {
                    setSelectedCity(pakistanCities.find(c => c.city === "Islamabad") || null);
                }
            } catch (e) {
                console.error("Failed to parse saved city, defaulting to Islamabad:", e);
                setSelectedCity(pakistanCities.find(c => c.city === "Islamabad") || null);
            }
        } else {
            setSelectedCity(pakistanCities.find(c => c.city === "Islamabad") || null);
        }

        const handleOrientation = (event: DeviceOrientationEvent) => {
            let alpha = event.alpha; 
            if (typeof alpha !== 'number') {
                setError(t('qibla.sensorError'));
                return;
            }
            if (typeof (event as any).webkitCompassHeading !== 'undefined') {
                alpha = (event as any).webkitCompassHeading;
            }
            setDirection(alpha);
            setError(''); 
        };
        
        const requestPermissions = async () => {
             if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
                const requestPermission = (DeviceOrientationEvent as any).requestPermission;
                if (typeof requestPermission === 'function') {
                    try {
                        const permissionState = await requestPermission();
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                        } else {
                            setError(t('qibla.permissionError'));
                        }
                    } catch (e: any) {
                         console.error(e);
                         setError(t('qibla.requestError'));
                    }
                } else {
                    window.addEventListener('deviceorientation', handleOrientation);
                }
            } else {
                setError(t('qibla.noSupportError'));
            }
        }

        requestPermissions();

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [t]);

    useEffect(() => {
        if (selectedCity) {
            localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
            calculateQibla(selectedCity.lat, selectedCity.lng);
        }
    }, [selectedCity]);

    const calculateQibla = (lat: number, lng: number) => {
        const toRad = (deg: number) => deg * (Math.PI / 180);

        const userLatRad = toRad(lat);
        const userLngRad = toRad(lng);
        const kaabaLatRad = toRad(KAABA_LAT);
        const kaabaLngRad = toRad(KAABA_LNG);

        const deltaLng = kaabaLngRad - userLngRad;
        const y = Math.sin(deltaLng);
        const x = Math.cos(userLatRad) * Math.tan(kaabaLatRad) - Math.sin(userLatRad) * Math.cos(deltaLng);
        let qibla = Math.atan2(y, x) * (180 / Math.PI);
        qibla = (qibla + 360) % 360;
        setQiblaDirection(qibla);

        const R = 6371; 
        const dLat = kaabaLatRad - userLatRad;
        const dLng = deltaLng;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(userLatRad) * Math.cos(kaabaLatRad) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        setDistance(R * c);
    };

    const handleGeoLocation = () => {
        if (!navigator.geolocation) {
            setError(t('qibla.geoError'));
            return;
        }
        setIsGpsLoading(true);
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const city: City = { city: t('prayer.location'), lat: latitude, lng: longitude, country: "", admin_name: "GPS" };
            setSelectedCity(city);
            setIsGpsLoading(false);
        }, () => {
            setError(t('qibla.geoPermissionError'));
            setIsGpsLoading(false);
        });
    };
    
    const compassRotationStyle = { transform: `rotate(${qiblaDirection - direction}deg)` };

    const getCardinalDirection = (angle: number) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.round(angle / 45) % 8];
    };

    return (
        <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
            <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 max-w-2xl mx-auto left-0 right-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high transition-colors p-2 rounded-full active:scale-95 duration-200">arrow_back</button>
                     <Link href="/home">
                      <h1 className="font-manrope font-extrabold tracking-tighter text-primary text-xl">{t('common.appName')}</h1>
                    </Link>
                </div>
                <div className="flex items-center">
                     <button className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                        <span className="material-symbols-outlined text-on-surface">brightness_3</span>
                    </button>
                    <button className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                        <span className="material-symbols-outlined text-on-surface-variant" data-icon="account_circle">account_circle</span>
                    </button>
                </div>
            </header>

            <main className="min-h-screen pt-24 pb-32 px-6 flex flex-col items-center max-w-xl mx-auto">
                 <section className="w-full mb-8">
                     <div className="flex flex-col gap-1">
                        <span className="text-label-md font-medium text-secondary tracking-widest uppercase opacity-80">{t('qibla.location')}</span>
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
                                            {selectedCity ? `${selectedCity.city}, ${selectedCity.admin_name}` : t('qibla.selectCity')}
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
                     <Button onClick={handleGeoLocation} disabled={isGpsLoading} className="w-full mt-2">
                        {isGpsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="material-symbols-outlined mr-2">my_location</span>}
                        {t('qibla.useMyLocation')}
                    </Button>
                </section>
                
                <div className="relative w-full aspect-square max-w-[360px] flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-surface-container-low border border-outline-variant/10 shadow-sm flex items-center justify-center" style={{ transform: `rotate(${-direction}deg)` }}>
                        <span className="absolute top-6 font-headline font-extrabold text-on-surface-variant/40">N</span>
                        <span className="absolute bottom-6 font-headline font-extrabold text-on-surface-variant/40">S</span>
                        <span className="absolute left-6 font-headline font-extrabold text-on-surface-variant/40">W</span>
                        <span className="absolute right-6 font-headline font-extrabold text-on-surface-variant/40">E</span>
                        <div className="absolute inset-0 rounded-full border-[12px] border-surface-container opacity-50"></div>
                    </div>
                    <div className="relative w-full h-full flex items-center justify-center transition-transform duration-1000 ease-out" style={compassRotationStyle}>
                        <div className="absolute w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl"></div>
                        <div className="relative w-full h-full flex flex-col items-center">
                            <div className="absolute top-4 w-4 h-32 qibla-gradient rounded-full shadow-lg shadow-primary/20 bg-gradient-to-b from-primary to-primary-container">
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 bg-secondary-container rounded-full border-4 border-surface flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[14px] text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>mosque</span>
                                </div>
                            </div>
                            <div className="absolute bottom-4 w-4 h-32 bg-surface-container-highest rounded-full"></div>
                        </div>
                    </div>
                    <div className="absolute w-12 h-12 rounded-full bg-surface-container-lowest shadow-xl flex items-center justify-center z-10">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                    </div>
                </div>

                <section className="w-full mt-12 grid grid-cols-1 gap-6">
                    <div className="bg-surface-container-low rounded-lg p-8 flex flex-col items-center justify-center text-center">
                        <span className="font-headline font-black text-6xl text-primary tracking-tighter mb-2">{Math.round(qiblaDirection)}° {getCardinalDirection(qiblaDirection)}</span>
                        <p className="font-body text-on-surface-variant/80">{t('qibla.angle')}</p>
                    </div>
                    <div className="bg-primary text-on-primary rounded-lg p-6 flex items-center gap-6 shadow-xl shadow-primary/10">
                        <div className="w-14 h-14 bg-on-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-3xl">explore</span>
                        </div>
                        <div>
                            <h3 className="font-headline font-bold text-lg mb-1">{t('qibla.facing')}</h3>
                            <p className="font-body text-sm text-on-primary/80 leading-relaxed">{t('qibla.instructions')}</p>
                        </div>
                    </div>
                </section>
                
                 {error && (
                    <Alert variant="destructive" className="mt-6 text-left w-full">
                        <span className="material-symbols-outlined h-4 w-4 mr-2">explore_off</span>
                        <AlertTitle>{t('qibla.sensorErrorTitle')}</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="w-full mt-8 grid grid-cols-1 gap-4">
                    <div className="bg-surface-container-high/50 p-4 rounded-lg flex flex-col items-center">
                        <span className="font-label text-[10px] uppercase tracking-widest text-secondary mb-1">{t('qibla.distance')}</span>
                        <span className="font-headline font-bold text-on-surface">{t('qibla.km').replace('{distance}', String(Math.round(distance)))}</span>
                    </div>
                </div>
            </main>

            <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/80 backdrop-blur-2xl flex justify-around items-center h-20 px-4 max-w-2xl mx-auto left-0 right-0">
                <Link href="/home" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90 tap-highlight-none">
                    <span className="material-symbols-outlined">home</span>
                    <span className="font-label text-sm font-medium tracking-wide">{t('nav.home')}</span>
                </Link>
                <Link href="/prayer-times" className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-5 py-1.5 transition-all tap-highlight-none active:scale-90">
                     <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>schedule</span>
                    <span className="font-label text-sm font-medium tracking-wide">{t('nav.prayer')}</span>
                </Link>
                <Link href="/tasbeeh" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90 tap-highlight-none">
                    <span className="material-symbols-outlined">adjust</span>
                    <span className="font-label text-sm font-medium tracking-wide">{t('nav.tasbeeh')}</span>
                </Link>
                <Link href="/islamic-calendar" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90 tap-highlight-none">
                    <span className="material-symbols-outlined">calendar_month</span>
                    <span className="font-label text-sm font-medium tracking-wide">{t('nav.calendar')}</span>
                </Link>
                <Link href="/settings" className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-transform active:scale-90 tap-highlight-none">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="font-label text-sm font-medium tracking-wide">{t('nav.settings')}</span>
                </Link>
            </nav>
        </div>
    );
}
