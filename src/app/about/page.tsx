
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from '@/hooks/use-translation';

export default function AboutPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 max-w-2xl mx-auto left-0 right-0">
          <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                  <span className="material-symbols-outlined text-on-surface">arrow_back</span>
              </button>
              <Link href="/home" className="text-primary font-manrope font-extrabold tracking-tighter text-xl">{t('common.appName')}</Link>
          </div>
            <button className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined text-on-surface">account_circle</span>
          </button>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.about')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 prose dark:prose-invert max-w-none">
            <p>
              The Islamic Daily Companion is your all-in-one tool for daily spiritual needs. 
              It provides accurate prayer times, a Qibla locator, a digital Tasbeeh counter, and an Islamic calendar 
              to help you stay connected to your faith.
            </p>
            <p>
              Built with modern technology, this app aims to provide a beautiful, simple, and reliable experience 
              for Muslims around the world.
            </p>

            <div className="pt-8 text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-primary">brightness_3</span>
                <p className="font-manrope font-black tracking-tighter text-on-surface-variant">Version 2026 — v1.0.0</p>
            </div>
            
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
