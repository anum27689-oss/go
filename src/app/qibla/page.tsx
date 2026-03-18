"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Compass, Navigation } from 'lucide-react';

export default function QiblaDirectionPage() {
  const [direction, setDirection] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(285); // Approximate Qibla direction from a central point
  const [error, setError] = useState('');
  
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let alpha = event.alpha; // Compass direction
      if (typeof alpha !== 'number') {
        setError('Your device or browser does not support compass direction.');
        return;
      }
      
      // For iOS devices
      if (typeof (event as any).webkitCompassHeading !== 'undefined') {
        alpha = (event as any).webkitCompassHeading;
      }

      setDirection(alpha);
    };

    if ('DeviceOrientationEvent' in window) {
      // Check for permissions
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        (DeviceOrientationEvent as any).requestPermission()
          .then((permissionState: 'granted' | 'denied') => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            } else {
              setError('Permission to access device orientation was denied.');
            }
          })
          .catch((e) => {
             console.error(e)
             setError('Error requesting device orientation permission.');
          });
      } else {
        // For non-iOS 13+ devices
        window.addEventListener('deviceorientation', handleOrientation);
      }
    } else {
      setError('Your device or browser does not support Device Orientation events.');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const rotation = qiblaDirection - direction;

  return (
    <div className="flex flex-col h-screen">
      <AppHeader title="Qibla Direction" />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Qibla</h2>
            <p className="text-muted-foreground mb-6">Point your device towards the Kaaba</p>
            
            <div className="relative w-64 h-64 mx-auto my-4 flex items-center justify-center">
                {/* Compass background */}
                <div 
                    className="absolute w-full h-full rounded-full bg-muted border-4 border-border"
                    style={{ transform: `rotate(${-direction}deg)` }}
                >
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-foreground">N</span>
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-muted-foreground">S</span>
                    <span className="absolute top-1/2 -translate-y-1/2 right-2 font-bold text-muted-foreground">E</span>
                    <span className="absolute top-1/2 -translate-y-1/2 left-2 font-bold text-muted-foreground">W</span>
                </div>

                {/* Qibla Arrow */}
                <div
                    className="transition-transform duration-500 ease-in-out"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <Navigation className="h-24 w-24 text-primary drop-shadow-lg" />
                </div>
            </div>

            <p className="text-lg font-medium">{Math.round(qiblaDirection)}° from North</p>

            {error && (
              <Alert variant="destructive" className="mt-6 text-left">
                <Compass className="h-4 w-4" />
                <AlertTitle>Sensor Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
