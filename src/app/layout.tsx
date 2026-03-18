import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const mosqueBg = PlaceHolderImages.find(p => p.id === 'mosque-background');

export const metadata: Metadata = {
  title: 'Islamic Daily Companion',
  description: 'Your daily companion for Islamic utilities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
           {mosqueBg && (
            <Image
              src={mosqueBg.imageUrl}
              alt={mosqueBg.description}
              fill
              className="bg-mosque object-cover opacity-10 dark:opacity-5"
              data-ai-hint={mosqueBg.imageHint}
            />
          )}
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
