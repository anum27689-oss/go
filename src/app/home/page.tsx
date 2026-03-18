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
  ToggleLeft,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const features = [
  { name: 'Prayer Times', icon: Clock, href: '/prayer-times' },
  { name: 'Tasbeeh Counter', icon: Repeat, href: '/tasbeeh' },
  { name: 'Qibla Direction', icon: Compass, href: '/qibla' },
  { name: 'Quran Audio', icon: BookAudio, href: '/quran-audio' },
  { name: 'Islamic Calendar', icon: CalendarDays, href: '/islamic-calendar' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Moon className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Islamic Daily Companion</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-6 w-6" />
                <span className="sr-only">Open Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Languages className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Language</span>
                  </div>
                  <Select defaultValue="english">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="urdu">Urdu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                     <span className="text-sm font-medium">Theme</span>
                  </div>
                  <ThemeToggle />
                </div>
                <Separator />
                <Link href="/privacy-policy" className="flex items-center gap-3 group">
                   <ShieldCheck className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                   <span className="text-sm font-medium group-hover:text-primary transition-colors">Privacy Policy</span>
                </Link>
                <a href="#" className="flex items-center gap-3 group">
                   <Star className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                   <span className="text-sm font-medium group-hover:text-primary transition-colors">Rate this App</span>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.name}>
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="flex flex-col items-center justify-center p-6 h-full text-center">
                  <feature.icon className="h-10 w-10 md:h-12 md:w-12 text-primary mb-3" />
                  <h3 className="text-sm md:text-base font-semibold">{feature.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center p-4 rounded-lg bg-secondary/50 border border-dashed">
            <p className="text-sm text-muted-foreground">Banner Ad Placeholder</p>
        </div>
      </main>
    </div>
  );
}
