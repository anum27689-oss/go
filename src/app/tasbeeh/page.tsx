"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TASBEEH_COUNT_KEY = 'tasbeeh_count';

export default function TasbeehCounterPage() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const savedCount = localStorage.getItem(TASBEEH_COUNT_KEY);
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(TASBEEH_COUNT_KEY, String(count));
  }, [count]);

  const increment = () => setCount(prev => prev + 1);
  const reset = () => setCount(0);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Tasbeeh Counter" />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="bg-secondary rounded-lg p-8 mb-6">
              <p className="text-7xl font-mono font-bold text-primary">{String(count).padStart(4, '0')}</p>
            </div>

            <div className="flex flex-col gap-4">
                <Button 
                  onClick={increment} 
                  className="h-32 text-2xl rounded-lg shadow-md transition-transform duration-150 active:scale-95"
                  aria-label="Increment count"
                >
                  Tap to Count
                </Button>

                <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
