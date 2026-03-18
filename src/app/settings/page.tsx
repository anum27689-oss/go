"use client";

import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex flex-col h-screen">
            <AppHeader title="Settings" />
            <main className="flex-1 container mx-auto p-4 md:p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Language</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="en">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="en" id="en" />
                                <Label htmlFor="en">English</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ur" id="ur" />
                                <Label htmlFor="ur">Urdu</Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="dark-mode">Dark Mode</Label>
                            <Switch
                                id="dark-mode"
                                checked={theme === 'dark'}
                                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="/privacy-policy" className="block text-primary hover:underline">
                            Privacy Policy
                        </Link>
                        <button className="block text-primary hover:underline">
                            Rate this app
                        </button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
