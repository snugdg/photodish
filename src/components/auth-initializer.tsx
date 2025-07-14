'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return <>{children}</>;
}
