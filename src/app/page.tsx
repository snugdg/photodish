'use client';

import { RecipeUploader } from '@/components/recipe-uploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Lightbulb, Heart, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(true);

  useEffect(() => {
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    
    if (!firebaseApiKey || firebaseApiKey.startsWith('NEXT_PUBLIC_')) {
      setIsFirebaseConfigured(false);
    }

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
    </>
  );
}
