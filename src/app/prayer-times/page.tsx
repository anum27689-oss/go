"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const prayerTimesData: { [city: string]: { [prayer: string]: string } } = {
  'New York': { Fajr: '04:30 AM', Dhuhr: '01:00 PM', Asr: '04:45 PM', Maghrib: '07:30 PM', Isha: '09:00 PM' },
  'London': { Fajr: '03:45 AM', Dhuhr: '12:50 PM', Asr: '05:30 PM', Maghrib: '08:45 PM', Isha: '10:15 PM' },
  'Makkah': { Fajr: '04:50 AM', Dhuhr: '12:25 PM', Asr: '03:50 PM', Maghrib: '06:40 PM', Isha: '08:10 PM' },
  'Jakarta': { Fajr: '04:40 AM', Dhuhr: '12:00 PM', Asr: '03:25 PM', Maghrib: '06:00 PM', Isha: '07:15 PM' },
  'Cairo': { Fajr: '03:50 AM', Dhuhr: '12:05 PM', Asr: '03:40 PM', Maghrib: '06:50 PM', Isha: '08:20 PM' },
  'Istanbul': { Fajr: '04:30 AM', Dhuhr: '01:10 PM', Asr: '05:00 PM', Maghrib: '08:10 PM', Isha: '09:40 PM' },
  'Moscow': { Fajr: '02:30 AM', Dhuhr: '12:30 PM', Asr: '05:00 PM', Maghrib: '08:50 PM', Isha: '10:50 PM' },
  'Beijing': { Fajr: '04:00 AM', Dhuhr: '12:20 PM', Asr: '03:50 PM', Maghrib: '07:10 PM', Isha: '08:30 PM' },
  'Sydney': { Fajr: '05:30 AM', Dhuhr: '12:00 PM', Asr: '02:45 PM', Maghrib: '05:15 PM', Isha: '06:45 PM' },
  'Toronto': { Fajr: '05:00 AM', Dhuhr: '01:20 PM', Asr: '05:10 PM', Maghrib: '08:00 PM', Isha: '09:30 PM' },
  'São Paulo': { Fajr: '05:10 AM', Dhuhr: '12:15 PM', Asr: '03:30 PM', Maghrib: '05:50 PM', Isha: '07:10 PM' },
};

const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function PrayerTimesPage() {
  const [selectedCity, setSelectedCity] = useState('Makkah');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }));
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <AppHeader title="Prayer Times" />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-medium">Daily Prayer Times</CardTitle>
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
            <ul className="space-y-1">
              {prayers.map((prayer, index) => (
                <li key={prayer}>
                  <div className="flex justify-between items-center p-3 rounded-lg hover:bg-accent">
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
