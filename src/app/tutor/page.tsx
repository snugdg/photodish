'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function TutorPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 font-headline">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You need to be signed in to use the AI Culinary Tutor.</p>
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
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Adaptive AI Culinary Tutor</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Grow your skills from a novice to a seasoned chef.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
           <p className="text-lg">
            This feature is coming soon!
          </p>
          <p className="mt-2 text-muted-foreground">
            Our AI will learn your cooking style and adapt recipe instructions to your skill level, suggesting new techniques to help you grow as a chef.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
