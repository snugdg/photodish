'use client';

import Link from 'next/link';
import {
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { ChefHat, LogIn, LogOut, User as UserIcon, Refrigerator, Dna, GraduationCap, Linkedin } from 'lucide-react';
import { XLogo } from './ui/x-logo';


export function Navbar() {
  const { user } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const AboutDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
         <Button variant="link">About the Dev</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
         <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center font-headline">Meet the Developer</DialogTitle>
        </DialogHeader>
        <div className="p-4 flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/sarmistha.jpg" alt="Sarmistha Ghosh" data-ai-hint="developer avatar" />
            <AvatarFallback>SG</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-xl font-bold font-headline">Sarmistha Ghosh</h3>
            <p className="text-muted-foreground mt-1 text-sm">A passionate developer who loves to cook and build amazing things with code. This project is a blend of my two passions!</p>
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="https://www.linkedin.com/in/sarmistha-ghosh-923171281/" target="_blank"><Linkedin /></Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href="https://x.com/sarmisthasoumi" target="_blank"><XLogo /></Link>
              </Button>
            </div>
          </div>
        </div>
         <DialogFooter className="justify-center">
            <Button asChild>
                <Link href="https://sarmista.dev" target='_blank'>View Portfolio</Link>
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">PhotoDish</span>
        </Link>
        <nav className="flex-1 items-center space-x-2 hidden md:flex">
          {user && (
            <>
              <Button variant="link" asChild>
                <Link href="/recipes">My Recipes</Link>
              </Button>
              <Button variant="link" asChild>
                <Link href="/pantry">Pantry</Link>
              </Button>
              <Button variant="link" asChild>
                <Link href="/flavor-profile">Flavor Profile</Link>
              </Button>
              <Button variant="link" asChild>
                <Link href="/tutor">AI Tutor</Link>
              </Button>
            </>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
           <AboutDialog />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback>{user.displayName?.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild className="md:hidden">
                  <Link href="/recipes" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>My Recipes</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="md:hidden">
                  <Link href="/pantry" className="cursor-pointer">
                    <Refrigerator className="mr-2 h-4 w-4" />
                    <span>Pantry</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="md:hidden">
                  <Link href="/flavor-profile" className="cursor-pointer">
                    <Dna className="mr-2 h-4 w-4" />
                    <span>Flavor Profile</span>
                  </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild className="md:hidden">
                  <Link href="/tutor" className="cursor-pointer">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>AI Tutor</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="md:hidden" />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleSignIn}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
