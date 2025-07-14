'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Dna } from 'lucide-react';
import Link from 'next/link';

export default function FlavorProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 font-headline">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You need to be signed in to build your Flavor Profile.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-50 duration-500">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <Dna className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Your Flavor DNA</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Discover and map your unique taste preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
           <p className="text-lg">
            This feature is coming soon!
          </p>
          <p className="mt-2 text-muted-foreground">
            Get ready to rate dishes and teach our AI about your palate. We'll use this to give you hyper-personalized recipe recommendations you're guaranteed to love.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
