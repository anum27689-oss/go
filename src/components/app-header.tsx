"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type AppHeaderProps = {
  title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2 mr-2">
          <span className="material-symbols-outlined h-6 w-6">arrow_back</span>
          <span className="sr-only">Go back</span>
        </Button>
        <h1 className="text-lg font-medium">{title}</h1>
      </div>
    </header>
  );
}
