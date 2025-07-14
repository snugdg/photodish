'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { Recipe } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ChefHat } from 'lucide-react';

export default function RecipesPage() {
  const { user, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchRecipes = async () => {
      try {
        const q = query(
          collection(db, 'recipes'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userRecipes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Recipe[];
        setRecipes(userRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user, authLoading]);
  
  if (loading || authLoading) {
    return (
      <>
        <h1 className="text-3xl font-bold mb-8 font-headline">My Saved Recipes</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 font-headline">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You need to be signed in to view your saved recipes.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 font-headline">No Recipes Yet!</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't saved any recipes. Let's create one!</p>
        <Button asChild>
          <Link href="/">Generate a New Recipe</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 font-headline">My Saved Recipes</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map(recipe => (
          <Dialog key={recipe.id}>
            <DialogTrigger asChild>
              <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 group">
                <div className="relative h-48 w-full">
                  <Image src={recipe.photoUrl} alt={recipe.name} fill objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                </div>
                <CardHeader>
                  <CardTitle className="truncate font-headline">{recipe.name}</CardTitle>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline">{recipe.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-4">
                <div className="relative h-64 md:h-auto">
                    <Image src={recipe.photoUrl} alt={recipe.name} fill objectFit="cover" className="rounded-md"/>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 font-headline">
                    <ChefHat className="w-6 h-6 text-primary" />
                    Ingredients
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <Separator className="my-4" />
                  <h3 className="text-xl font-semibold mb-4 font-headline">Instructions</h3>
                  <Tabs defaultValue="expert" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="expert">Expert</TabsTrigger>
                      {recipe.simpleInstructions && recipe.simpleInstructions.length > 0 && (
                        <TabsTrigger value="simple">Simple</TabsTrigger>
                      )}
                    </TabsList>
                    <TabsContent value="expert" className="mt-4 prose">
                      <ol className="list-decimal list-inside space-y-3">
                        {recipe.instructions.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </TabsContent>
                    {recipe.simpleInstructions && recipe.simpleInstructions.length > 0 && (
                       <TabsContent value="simple" className="mt-4 prose">
                        <ol className="list-decimal list-inside space-y-3">
                          {recipe.simpleInstructions.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </>
  );
}
