"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const islamicMonths = [
    "Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani",
    "Jumada al-ula", "Jumada al-ukhra", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

export default function IslamicCalendarPage() {
    const [hijriDate, setHijriDate] = useState('');
    const [gregorianDate, setGregorianDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        const today = new Date();
        setGregorianDate(today);
        try {
            const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            setHijriDate(hijriFormatter.format(today));
        } catch (e) {
            console.error("Could not format Hijri date:", e);
            setHijriDate("Hijri date not available.");
        }
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <AppHeader title="Islamic Calendar" />
            <main className="flex-1 container mx-auto p-4 md:p-6 space-y-6 overflow-y-auto">
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle className="text-primary">Today's Hijri Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{hijriDate}</p>
                    </CardContent>
                </Card>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gregorian Calendar</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={gregorianDate}
                                onSelect={setGregorianDate}
                                className="rounded-md border"
                                disabled
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Islamic Months</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {islamicMonths.map((month, index) => (
                                    <li key={month}>
                                        <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">{index + 1}</span>
                                            <span className="font-medium">{month}</span>
                                        </div>
                                        {index < islamicMonths.length - 1 && <Separator />}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
