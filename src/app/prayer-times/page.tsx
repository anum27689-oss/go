"use client";

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const prayerTimesData: { [city: string]: { [prayer: string]: string } } = {
  'New York': { Fajr: '04:30 AM', Dhuhr: '01:00 PM', Asr: '04:45 PM', Maghrib: '07:30 PM', Isha: '09:00 PM' },
  'London': { Fajr: '03:45 AM', Dhuhr: '12:50 PM', Asr: '05:30 PM', Maghrib: '08:45 PM', Isha: '10:15 PM' },
  'Makkah': { Fajr: '04:50 AM', Dhuhr: '12:25 PM', Asr: '03:50 PM', Maghrib: '06:40 PM', Isha: '08:10 PM' },
};

const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function PrayerTimesPage() {
  const [selectedCity, setSelectedCity] = useState('Makkah');
  const [currentDate, setCurrentDate] = useState('');

  // Effect to set date on client
  useState(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }));
  });

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Prayer Times" />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Daily Prayer Times</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">{currentDate}</p>
              </div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(prayerTimesData).map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {prayers.map((prayer, index) => (
                <li key={prayer}>
                  <div className="flex justify-between items-center p-3 rounded-lg hover:bg-secondary/50">
                    <span className="font-medium">{prayer}</span>
                    <span className="font-semibold text-primary">{prayerTimesData[selectedCity][prayer]}</span>
                  </div>
                  {index < prayers.length - 1 && <Separator />}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
