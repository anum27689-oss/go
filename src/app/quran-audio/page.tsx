
"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/auth/UserAvatar';

// Define the type for a single Surah
type Surah = {
    number: number;
    name: string; // Arabic name
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
};

// Define the type for the API response
type SurahApiResponse = {
    code: number;
    status: string;
    data: Surah[];
};

const LAST_PLAYED_SURAH_KEY = 'quran_last_played';
const FAVORITE_SURAHS_KEY = 'quran_favorites';


export default function QuranAudioPage() {
    const router = useRouter();
    const { t, language } = useTranslation();
    const [allSurahs, setAllSurahs] = useState<Surah[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [currentlyPlaying, setCurrentlyPlaying] = useState<Surah | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const [lastPlayed, setLastPlayed] = useState<Surah | null>(null);
    const [favorites, setFavorites] = useState<number[]>([]);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const fetchSurahs = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://api.alquran.cloud/v1/surah');
                if (!response.ok) {
                    throw new Error(t('quran.fetchError'));
                }
                const data: SurahApiResponse = await response.json();
                if (data.code === 200) {
                    setAllSurahs(data.data);

                    const savedFavoritesJSON = localStorage.getItem(FAVORITE_SURAHS_KEY);
                    if (savedFavoritesJSON) {
                        try {
                           setFavorites(JSON.parse(savedFavoritesJSON));
                        } catch(e) {
                            console.error("Failed to parse favorites from localStorage", e);
                        }
                    }
        
                    const lastPlayedNumber = localStorage.getItem(LAST_PLAYED_SURAH_KEY);
                    if (lastPlayedNumber) {
                        const lastPlayedSurah = data.data.find(s => s.number === parseInt(lastPlayedNumber));
                        if (lastPlayedSurah) {
                            setLastPlayed(lastPlayedSurah);
                        }
                    }

                } else {
                     throw new Error(t('quran.fetchError'));
                }
            } catch (error) {
                console.error("Failed to fetch Surahs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSurahs();
    }, [t]);

    const filteredSurahs = useMemo(() => {
        if (!searchQuery) {
            return allSurahs;
        }
        return allSurahs.filter(surah =>
            surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(surah.number).includes(searchQuery)
        );
    }, [allSurahs, searchQuery]);

    const handlePlayPause = (surah: Surah) => {
        if (currentlyPlaying?.number === surah.number) {
            if (isPlaying) {
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                audioRef.current?.play();
                setIsPlaying(true);
            }
        } else {
            setCurrentlyPlaying(surah);
            setLastPlayed(surah);
            localStorage.setItem(LAST_PLAYED_SURAH_KEY, String(surah.number));
            if (audioRef.current) {
                const audioSrc = `https://server7.mp3quran.net/s_gmd/${String(surah.number).padStart(3, '0')}.mp3`;
                audioRef.current.src = audioSrc;
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(e => {
                    console.error("Playback failed. User interaction may be required.", e)
                    setIsPlaying(false);
                });
            }
        }
    };
    
    const playNext = () => {
        if(!currentlyPlaying) return;
        const currentIndex = allSurahs.findIndex(s => s.number === currentlyPlaying.number);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + 1) % allSurahs.length;
        handlePlayPause(allSurahs[nextIndex]);
    }

    const playPrev = () => {
        if(!currentlyPlaying) return;
        const currentIndex = allSurahs.findIndex(s => s.number === currentlyPlaying.number);
        if (currentIndex === -1) return;
        const prevIndex = (currentIndex - 1 + allSurahs.length) % allSurahs.length;
        handlePlayPause(allSurahs[prevIndex]);
    }
    
    const toggleFavorite = (surahNumber: number) => {
        const newFavorites = favorites.includes(surahNumber)
            ? favorites.filter(num => num !== surahNumber)
            : [...favorites, surahNumber];
        setFavorites(newFavorites);
        localStorage.setItem(FAVORITE_SURAHS_KEY, JSON.stringify(newFavorites));
    };

    const handleTimeUpdate = () => {
        if (audioRef.current && isFinite(audioRef.current.duration)) {
            const newProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(newProgress);
        }
    };
    
    const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current && currentlyPlaying && isFinite(audioRef.current.duration)) {
            const progressBar = event.currentTarget;
            const clickPosition = event.clientX - progressBar.getBoundingClientRect().left;
            const newTime = (clickPosition / progressBar.offsetWidth) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
        }
    };


    return (
        <div className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
            <header className="fixed top-0 w-full z-30 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 max-w-2xl mx-auto left-0 right-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="hover:bg-surface-container-high transition-colors p-2 rounded-full active:scale-95 duration-200">
                        <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
                    </button>
                    <Link href="/home">
                        <h1 className="text-primary font-headline font-extrabold tracking-tighter text-xl md:text-2xl">{t('common.appName')}</h1>
                    </Link>
                </div>
                 <UserAvatar />
            </header>

            <main className="pt-24 pb-40 px-6 max-w-2xl mx-auto">
                <section className="mb-10">
                    <h2 className={cn("font-headline font-extrabold text-4xl mb-6 tracking-tight", language === 'en' && 'text-3xl')}>{t('quran.title')}</h2>
                    <div className="relative flex items-center">
                        <div className="absolute left-4 pointer-events-none">
                            <span className="material-symbols-outlined text-secondary">search</span>
                        </div>
                        <input 
                            className="w-full bg-surface-container-high border-none h-14 pl-12 pr-6 rounded-xl focus:ring-2 focus:ring-primary-fixed-dim transition-all text-on-surface placeholder:text-on-surface-variant/50" 
                            placeholder={t('quran.search')} 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4 mb-10">
                     <div 
                        onClick={() => lastPlayed && handlePlayPause(lastPlayed)}
                        className={`bg-primary-container p-6 rounded-lg text-on-primary-container flex flex-col justify-between h-40 ${lastPlayed ? 'cursor-pointer hover:bg-primary-container/90' : 'cursor-default'}`}
                    >
                        <span className="material-symbols-outlined text-primary-fixed text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>auto_stories</span>
                        <div>
                            <p className="font-label text-sm opacity-80">{t('quran.lastRead')}</p>
                            <h3 className="font-headline font-bold text-xl truncate">{lastPlayed ? lastPlayed.englishName : t('quran.none')}</h3>
                        </div>
                    </div>
                    <div className="bg-secondary-container p-6 rounded-lg text-on-secondary-container flex flex-col justify-between h-40">
                        <span className="material-symbols-outlined text-secondary text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
                        <div>
                            <p className="font-label text-sm opacity-80">{t('quran.favorites')}</p>
                            <h3 className="font-headline font-bold text-xl">{favorites.length > 1 ? t('quran.surahs').replace('{count}', String(favorites.length)) : t('quran.surah').replace('{count}', String(favorites.length))}</h3>
                        </div>
                    </div>
                </section>

                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-surface-container-lowest p-5 flex items-center gap-5 rounded-lg animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-surface-container-high"></div>
                                <div className="flex-grow">
                                    <div className="h-5 w-3/4 bg-surface-container-high rounded"></div>
                                    <div className="h-4 w-1/2 bg-surface-container-high rounded mt-2"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        filteredSurahs.map((surah) => (
                            <div 
                                key={surah.number}
                                onClick={() => handlePlayPause(surah)}
                                className={`
                                    transition-all p-5 flex items-center gap-5 rounded-lg active:scale-[0.98] cursor-pointer group
                                    ${currentlyPlaying?.number === surah.number ? 'bg-surface-container-low border-l-4 border-primary' : 'bg-surface-container-lowest hover:bg-surface-container'}
                                `}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-headline font-bold shrink-0 relative
                                    ${currentlyPlaying?.number === surah.number ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-primary'}
                                `}>
                                    {String(surah.number).padStart(2, '0')}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="font-headline font-bold text-lg">{surah.englishName}</h4>
                                        <span className="font-headline text-xl text-primary/80">{surah.name}</span>
                                    </div>
                                    <div className="flex gap-2 items-center text-on-surface-variant/70 text-sm mt-1">
                                        <span>{t('quran.translation').replace('{translation}', surah.englishNameTranslation)}</span>
                                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                                        <span>{t('quran.verses').replace('{count}', String(surah.numberOfAyahs))}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                     <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(surah.number);
                                        }}
                                        className="p-2 rounded-full text-secondary/70 hover:text-secondary hover:bg-secondary/10 transition-colors z-10"
                                    >
                                        <span 
                                            className="material-symbols-outlined transition-all"
                                            style={favorites.includes(surah.number) ? {fontVariationSettings: "'FILL' 1"} : {}}
                                        >
                                            favorite
                                        </span>
                                    </button>
                                    <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform text-4xl">
                                        { (isPlaying && currentlyPlaying?.number === surah.number) ? 'pause_circle' : 'play_circle' }
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {currentlyPlaying && (
                 <div className="fixed bottom-20 left-0 right-0 z-40 px-4 max-w-2xl mx-auto">
                    <div className="bg-surface/90 backdrop-blur-2xl p-4 rounded-xl flex items-center gap-4 shadow-xl border border-outline-variant/10">
                        <div className="w-12 h-12 rounded-lg bg-primary shrink-0 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container"></div>
                            <span className="material-symbols-outlined text-on-primary relative z-10 text-3xl">music_note</span>
                        </div>
                        <div className="flex-grow min-w-0">
                            <h5 className="font-headline font-bold truncate text-sm">{currentlyPlaying.englishName}</h5>
                            <p className="text-xs text-on-surface-variant truncate">{t('quran.reciter')}</p>
                            <div className="w-full bg-surface-container-high h-1 rounded-full mt-2 overflow-hidden cursor-pointer" onClick={handleSeek}>
                                <div className="bg-primary h-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <button onClick={playPrev} className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-90"><span className="material-symbols-outlined text-2xl">skip_previous</span></button>
                            <button onClick={() => handlePlayPause(currentlyPlaying)} className="p-2.5 bg-primary text-on-primary rounded-full transition-all active:scale-90 flex items-center justify-center">
                                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>{isPlaying ? 'pause' : 'play_arrow'}</span>
                            </button>
                            <button onClick={playNext} className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-90"><span className="material-symbols-outlined text-2xl">skip_next</span></button>
                        </div>
                    </div>
                </div>
            )}
            
            <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={playNext} />

            <nav className="fixed bottom-0 w-full z-20 bg-surface/80 backdrop-blur-2xl flex justify-around items-center h-20 px-2 max-w-2xl mx-auto left-0 right-0 pb-[env(safe-area-inset-bottom)]">
                <Link href="/home" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant rounded-xl p-2 h-14 w-16 transition-all duration-200 active:scale-90 tap-highlight-none hover:bg-surface-container-high">
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-xs font-medium">{t('nav.home')}</span>
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
        </div>
    );
}
