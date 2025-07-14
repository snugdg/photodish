'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Refrigerator } from 'lucide-react';
import Link from 'next/link';

export default function PantryPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 font-headline">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You need to be signed in to use the Pantry feature.</p>
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
            <Refrigerator className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Pantry & Meal Planner</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Reduce waste and plan your meals intelligently.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg">
            This feature is coming soon!
          </p>
          <p className="mt-2 text-muted-foreground">
            Soon, you'll be able to upload a photo of your fridge or pantry, and our AI will generate a meal plan and an optimized shopping list to help you save time and money.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
