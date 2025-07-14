
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex justify-center items-center h-full animate-in fade-in-50 duration-500">
      <Card className="max-w-xl mx-auto mt-10">
        <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold font-headline">Meet the Developer</CardTitle>
        </CardHeader>
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
    </div>
  );
}
