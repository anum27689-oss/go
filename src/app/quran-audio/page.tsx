"use client";

import { useState, useRef } from 'react';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const surahs = [
    { number: 1, name: "Al-Fatihah", englishName: "The Opening", audio: "https://server7.mp3quran.net/s_gmd/001.mp3" },
    { number: 18, name: "Al-Kahf", englishName: "The Cave", audio: "https://server7.mp3quran.net/s_gmd/018.mp3" },
    { number: 36, name: "Ya-Sin", englishName: "Ya Sin", audio: "https://server7.mp3quran.net/s_gmd/036.mp3" },
    { number: 55, name: "Ar-Rahman", englishName: "The Beneficent", audio: "https://server7.mp3quran.net/s_gmd/055.mp3" },
    { number: 67, name: "Al-Mulk", englishName: "The Sovereignty", audio: "https://server7.mp3quran.net/s_gmd/067.mp3" },
    { number: 112, name: "Al-Ikhlas", englishName: "The Sincerity", audio: "https://server7.mp3quran.net/s_gmd/112.mp3" },
    { number: 113, name: "Al-Falaq", englishName: "The Daybreak", audio: "https://server7.mp3quran.net/s_gmd/113.mp3" },
    { number: 114, name: "An-Nas", englishName: "Mankind", audio: "https://server7.mp3quran.net/s_gmd/114.mp3" },
];

type Surah = typeof surahs[0];

export default function QuranAudioPage() {
    const [currentlyPlaying, setCurrentlyPlaying] = useState<Surah | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

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
            setIsPlaying(true);
            if (audioRef.current) {
                audioRef.current.src = surah.audio;
                audioRef.current.play();
            }
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <AppHeader title="Quran Audio" />
            <main className="flex-1 container mx-auto p-4 md:p-6 flex flex-col gap-4">
                {currentlyPlaying && (
                    <Card className="bg-primary/10 border-primary/20">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Volume2 className="w-6 h-6 text-primary" />
                                <div>
                                    <p className="font-semibold">{currentlyPlaying.name}</p>
                                    <p className="text-sm text-muted-foreground">{currentlyPlaying.englishName}</p>
                                </div>
                            </div>
                            <Button onClick={() => handlePlayPause(currentlyPlaying)} size="icon" variant="ghost">
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                            </Button>
                        </CardContent>
                    </Card>
                )}
                
                <Card className="flex-1">
                  <ScrollArea className="h-full">
                      <CardContent className="p-0">
                          <ul>
                              {surahs.map((surah, index) => (
                                  <li key={surah.number}>
                                      <button 
                                          onClick={() => handlePlayPause(surah)} 
                                          className={`w-full text-left p-4 flex items-center justify-between transition-colors ${currentlyPlaying?.number === surah.number ? 'bg-accent' : 'hover:bg-accent'}`}
                                      >
                                          <div className="flex items-center gap-4">
                                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">{surah.number}</span>
                                              <div>
                                                  <p className="font-semibold">{surah.name}</p>
                                                  <p className="text-sm text-muted-foreground">{surah.englishName}</p>
                                              </div>
                                          </div>
                                          {(currentlyPlaying?.number === surah.number && isPlaying) ? <Pause className="w-5 h-5 text-primary" /> : <Play className="w-5 h-5 text-muted-foreground" />}
                                      </button>
                                      {index < surahs.length - 1 && <Separator />}
                                  </li>
                              ))}
                          </ul>
                      </CardContent>
                  </ScrollArea>
                </Card>
            </main>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        </div>
    );
}
