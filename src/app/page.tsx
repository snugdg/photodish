'use client';

import { RecipeUploader } from '@/components/recipe-uploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Utensils, Lightbulb, Heart, AlertTriangle, Github, Linkedin, Twitter } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);

  useEffect(() => {
    setIsFirebaseConfigured(!!(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.FIREBASE_SERVICE_ACCOUNT));
  }, []);

  return (
    <>
      <section className="text-center mb-12 animate-in fade-in-50 slide-in-from-top-4 duration-500">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 font-headline text-primary">
          From Photo to Fork
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
          Ever seen a dish so good you wished you had the recipe? Now you can.
          Just upload a picture, and let our AI chef do the rest.
        </p>
      </section>

      {!isFirebaseConfigured && (
        <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Action Required: Configure Firebase</AlertTitle>
          <AlertDescription>
            This app requires Firebase configuration to run. Please create a
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">.env.local</code>
            file in the project root and add your Firebase web app config and service account key.
            Without these, login and recipe saving will not work.
          </AlertDescription>
        </Alert>
      )}

      <RecipeUploader />

      <section className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-8 font-headline">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <Utensils className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline">1. Upload a Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Snap a picture of any dish or upload an image you found online.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center animate-in fade-in-50 slide-in-from-bottom-4 duration-500" style={{animationDelay: '150ms'}}>
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline">2. AI Magic</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our advanced AI analyzes the image to identify ingredients and cooking methods.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center animate-in fade-in-50 slide-in-from-bottom-4 duration-500" style={{animationDelay: '300ms'}}>
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline">3. Get Cooking!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Receive a complete recipe, save it, and start your culinary adventure.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-20 animate-in fade-in-50 duration-500">
        <h2 className="text-3xl font-bold text-center mb-8 font-headline">Meet the Developer</h2>
        <Card className="max-w-xl mx-auto">
          <CardContent className="p-8 flex flex-col sm:flex-row items-center gap-8">
            <Avatar className="h-32 w-32">
              <AvatarImage src="https://github.com/shadcn.png" alt="Developer Avatar" data-ai-hint="developer avatar" />
              <AvatarFallback>DV</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold font-headline">Your Name</h3>
              <p className="text-muted-foreground mt-1">A passionate developer who loves to cook and build amazing things with code. This project is a blend of my two passions!</p>
              <div className="flex justify-center sm:justify-start gap-4 mt-4">
                <Button variant="outline" size="icon" asChild>
                  <Link href="#" target="_blank"><Github /></Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href="#" target="_blank"><Linkedin /></Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href="#" target="_blank"><Twitter /></Link>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center sm:justify-end">
            <Button asChild>
              <Link href="#">View Portfolio</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
