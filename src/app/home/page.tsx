"use client";

import Link from 'next/link';
import { 
  Moon, 
  Clock, 
  Repeat, 
  Compass, 
  BookAudio, 
  CalendarDays,
  Settings,
  Languages,
  ShieldCheck,
  Star,
  ChevronRight,
  Sun
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const features = [
  { name: 'Prayer Times', icon: Clock, href: '/prayer-times', description: 'View daily prayer timings' },
  { name: 'Tasbeeh Counter', icon: Repeat, href: '/tasbeeh', description: 'Digital counter for your dhikr' },
  { name: 'Qibla Direction', icon: Compass, href: '/qibla', description: 'Find the direction of Kaaba' },
  { name: 'Quran Audio', icon: BookAudio, href: '/quran-audio', description: 'Listen to popular surahs' },
  { name: 'Islamic Calendar', icon: CalendarDays, href: '/islamic-calendar', description: 'Hijri and Gregorian dates' },
];

function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="flex items-center justify-between p-2 rounded-lg">
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center">
                    {isDark ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
                </div>
                <span className="text-sm font-medium">Dark Mode</span>
            </div>
            <Switch checked={isDark} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
        </div>
    );
}

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Moon className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Islamic Companion</h1>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                <Settings className="h-6 w-6" />
                <span className="sr-only">Open Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-2">
                 <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                   <div className="flex items-center gap-3">
                    <Languages className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Language</span>
                  </div>
                  <Select defaultValue="english">
                    <SelectTrigger className="w-[120px] bg-transparent border-0 focus:ring-0">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="urdu">Urdu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <ThemeSwitch />
                
                <Separator className="my-2"/>
                
                <Link href="/privacy-policy" className="flex items-center w-full gap-3 p-2 rounded-lg hover:bg-accent group">
                   <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                   <span className="text-sm font-medium">Privacy Policy</span>
                </Link>
                <a href="#" className="flex items-center w-full gap-3 p-2 rounded-lg hover:bg-accent group">
                   <Star className="h-5 w-5 text-muted-foreground" />
                   <span className="text-sm font-medium">Rate this App</span>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 space-y-4">
          <Card>
            <ul>
              {features.map((feature, index) => (
                <li key={feature.name}>
                  <Link href={feature.href} className="block transition-colors hover:bg-accent">
                    <div className="flex items-center p-4">
                      <div className="bg-primary/10 p-2 rounded-full mr-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{feature.name}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>
                  {index < features.length - 1 && <Separator />}
                </li>
              ))}
            </ul>
          </Card>
          
          <div className="text-center p-4 rounded-lg bg-muted border border-dashed">
              <p className="text-xs text-muted-foreground">Ad placeholder</p>
          </div>
        </div>
      </main>
    </div>
  );
}
