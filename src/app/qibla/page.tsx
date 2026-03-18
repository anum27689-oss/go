"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Compass, Triangle } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Qibla Direction" />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-lg text-center">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">Qibla</h2>
            <p className="text-muted-foreground mb-6">Point your device towards the Kaaba</p>
            
            <div className="relative w-64 h-64 mx-auto my-4 flex items-center justify-center">
                {/* Compass background */}
                <div 
                    className="absolute w-full h-full rounded-full bg-secondary border-4 border-primary/20"
                    style={{ transform: `rotate(${-direction}deg)` }}
                >
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 font-bold text-primary">N</span>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-bold">S</span>
                    <span className="absolute top-1/2 -translate-y-1/2 right-1 font-bold">E</span>
                    <span className="absolute top-1/2 -translate-y-1/2 left-1 font-bold">W</span>
                </div>

                {/* Qibla Arrow */}
                <div
                    className="transition-transform duration-500 ease-in-out"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <svg width="100" height="100" viewBox="0 0 24 24" className="fill-current text-primary drop-shadow-lg">
                      <path d="M12 2L2 22h20L12 2zm0 4.236L16.236 18H7.764L12 6.236z"/>
                  </svg>
                </div>
            </div>

            <p className="text-lg font-semibold">{Math.round(qiblaDirection)}° from North</p>

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
