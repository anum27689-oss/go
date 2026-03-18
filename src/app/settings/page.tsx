"use client";

import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
    const { theme, setTheme } = useTheme();
    const [calculationMethod, setCalculationMethod] = useState('2');
    const [timeFormat, setTimeFormat] = useState('12h');

    useEffect(() => {
        const savedMethod = localStorage.getItem('prayerCalculationMethod');
        if (savedMethod) {
            setCalculationMethod(savedMethod);
        }
        const savedFormat = localStorage.getItem('prayerTimeFormat');
        if (savedFormat) {
            setTimeFormat(savedFormat);
        }
    }, []);

    const handleMethodChange = (value: string) => {
        setCalculationMethod(value);
        localStorage.setItem('prayerCalculationMethod', value);
    };

    const handleTimeFormatChange = (value: string) => {
        setTimeFormat(value);
        localStorage.setItem('prayerTimeFormat', value);
    };


    return (
        <div className="flex flex-col h-screen">
            <AppHeader title="Settings" />
            <main className="flex-1 container mx-auto p-4 md:p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Prayer Time Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="calculation-method">Calculation Method</Label>
                            <Select onValueChange={handleMethodChange} value={calculationMethod}>
                                <SelectTrigger id="calculation-method">
                                    <SelectValue placeholder="Select calculation method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {calculationMethods.map(method => (
                                        <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div>
                            <Label>Time Format</Label>
                            <RadioGroup value={timeFormat} onValueChange={handleTimeFormatChange} className="mt-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="12h" id="12h" />
                                    <Label htmlFor="12h">12-hour</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="24h" id="24h" />
                                    <Label htmlFor="24h">24-hour</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="dark-mode">Dark Mode</Label>
                            <Switch
                                id="dark-mode"
                                checked={theme === 'dark'}
                                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="/privacy-policy" className="block text-primary hover:underline">
                            Privacy Policy
                        </Link>
                        <button className="block text-primary hover:underline">
                            Rate this app
                        </button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
