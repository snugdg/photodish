'use client';

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { summarizeRecipe } from '@/ai/flows/summarize-recipe';
import type { GenerateRecipeFromPhotoOutput } from '@/ai/flows/generate-recipe-from-photo';
import { suggestDrinkPairing, SuggestDrinkPairingOutput } from '@/ai/flows/suggest-drink-pairing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ChefHat, Heart, Clipboard, Loader2, Wand2, GlassWater, Wine, Beer } from 'lucide-react';
import { Separator } from './ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { saveRecipeAction } from '@/lib/actions';
import { remixRecipe } from '@/ai/flows/remix-recipe';
import { Textarea } from './ui/textarea';
import { Skeleton } from './ui/skeleton';

type Recipe = GenerateRecipeFromPhotoOutput['recipe'];

interface RecipeDisplayProps {
  initialRecipe: Recipe;
  photoUrl: string;
}

export function RecipeDisplay({ initialRecipe, photoUrl }: RecipeDisplayProps) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [simpleInstructions, setSimpleInstructions] = useState<string[] | null>(null);
  const [drinkPairings, setDrinkPairings] = useState<SuggestDrinkPairingOutput | null>(null);
  const [remixPrompt, setRemixPrompt] = useState('');
  const [isRemixing, startRemixTransition] = useTransition();
  const [isLoadingSummary, startSummaryTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();
  const [isLoadingPairings, startPairingTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch drink pairings when the recipe changes
    startPairingTransition(async () => {
      try {
        const pairings = await suggestDrinkPairing({
          recipeName: recipe.name,
          recipeIngredients: recipe.ingredients,
        });
        setDrinkPairings(pairings);
      } catch (error) {
        // Don't show a toast for this, as it's a non-critical feature
        console.error("Error fetching drink pairings:", error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe]);

  const getSimpleInstructions = async () => {
    if (simpleInstructions) return;
    
    startSummaryTransition(async () => {
      try {
        const fullRecipeText = `Ingredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions.join('\n')}`;
        const result = await summarizeRecipe({ recipe: fullRecipeText, mode: 'Simple' });
        const summarizedInstructions = result.summary
          .split('\n')
          .filter(line => line.trim() !== '' && !line.toLowerCase().includes('instructions:'))
          .map(line => line.replace(/^\d+\.\s*/, ''));
        setSimpleInstructions(summarizedInstructions);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error simplifying recipe',
          description: 'Could not generate simple instructions. Please try again.',
        });
      }
    });
  };

  const handleRemixRecipe = () => {
    if (!remixPrompt) {
      toast({
        variant: 'destructive',
        title: 'Remix prompt is empty',
        description: 'Please enter what you want to change.',
      });
      return;
    }

    startRemixTransition(async () => {
      try {
        // Reset dependent state before fetching new data
        setRecipe(prev => ({...prev, name: `Remix of ${prev.name}`})); // Optimistic UI update
        setSimpleInstructions(null);
        setDrinkPairings(null);
        
        const result = await remixRecipe({
          recipe: {
            name: recipe.name,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
          },
          prompt: remixPrompt,
        });
        setRecipe(result.recipe);
        toast({
          title: 'Recipe Remixed!',
          description: 'Your recipe has been updated with your changes.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error remixing recipe',
          description: 'Could not remix the recipe. Please try again.',
        });
      }
    });
  };

  const handleSaveRecipe = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not logged in',
        description: 'Please sign in to save recipes.',
      });
      return;
    }

    startSavingTransition(async () => {
      try {
        await saveRecipeAction({
          name: recipe.name,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          simpleInstructions: simpleInstructions ?? undefined,
          photoUrl: photoUrl,
        });
        toast({
          title: 'Recipe Saved!',
          description: `"${recipe.name}" has been added to your collection.`,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error saving recipe',
          description: 'There was a problem saving your recipe. Please try again.',
        });
      }
    });
  };

  const copyToClipboard = () => {
    const recipeText = `
Recipe: ${recipe.name}

Ingredients:
${recipe.ingredients.map(i => `- ${i}`).join('\n')}

Instructions (Expert):
${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}

${simpleInstructions ? `\nInstructions (Simple):\n${simpleInstructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}` : ''}
    `.trim();
    navigator.clipboard.writeText(recipeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PairingCard = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold flex items-center gap-2 font-headline">
        <Wine className="w-6 h-6 text-primary" />
        Drink Pairings
      </h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {isLoadingPairings ? (
          <>
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </>
        ) : (
          <>
            {drinkPairings?.wine && (
              <Card className="flex flex-col relative overflow-hidden">
                 <div className="relative h-32 w-full">
                   <Image src="https://placehold.co/300x200" alt={drinkPairings.wine.name} fill objectFit="cover" data-ai-hint={drinkPairings.wine.imageHint} />
                 </div>
                 <CardContent className="p-4 flex-grow">
                   <h4 className="font-bold">{drinkPairings.wine.name}</h4>
                   <p className="text-xs text-muted-foreground mt-1">{drinkPairings.wine.reason}</p>
                 </CardContent>
              </Card>
            )}
            {drinkPairings?.beer && (
              <Card className="flex flex-col relative overflow-hidden">
                <div className="relative h-32 w-full">
                  <Image src="https://placehold.co/300x200" alt={drinkPairings.beer.name} fill objectFit="cover" data-ai-hint={drinkPairings.beer.imageHint} />
                </div>
                <CardContent className="p-4 flex-grow">
                  <h4 className="font-bold">{drinkPairings.beer.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{drinkPairings.beer.reason}</p>
                </CardContent>
              </Card>
            )}
            {drinkPairings?.nonAlcoholic && (
              <Card className="flex flex-col relative overflow-hidden">
                 <div className="relative h-32 w-full">
                  <Image src="https://placehold.co/300x200" alt={drinkPairings.nonAlcoholic.name} fill objectFit="cover" data-ai-hint={drinkPairings.nonAlcoholic.imageHint} />
                 </div>
                <CardContent className="p-4 flex-grow">
                  <h4 className="font-bold">{drinkPairings.nonAlcoholic.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{drinkPairings.nonAlcoholic.reason}</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden animate-in fade-in-50 duration-500">
      <CardHeader className="p-0">
        <div className="relative h-64">
          <Image src={photoUrl} alt={recipe.name} layout="fill" objectFit="cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 p-6 w-full">
            <CardTitle className="text-3xl font-bold text-white drop-shadow-md font-headline">
              {recipe.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
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
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy to clipboard">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
            </Button>
            {user && (
              <Button variant="outline" size="icon" onClick={handleSaveRecipe} disabled={isSaving} aria-label="Save Recipe">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>
        
        <Separator className="my-6" />

        <h3 className="text-xl font-semibold mb-4 font-headline">Instructions</h3>
        <Tabs defaultValue="expert" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expert">Expert</TabsTrigger>
            <TabsTrigger value="simple" onClick={getSimpleInstructions}>
              {isLoadingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simple
            </TabsTrigger>
          </TabsList>
          <TabsContent value="expert" className="mt-4">
            <ol className="list-decimal list-inside space-y-3 prose">
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </TabsContent>
          <TabsContent value="simple" className="mt-4">
            {simpleInstructions ? (
              <ol className="list-decimal list-inside space-y-3 prose">
                {simpleInstructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                {isLoadingSummary ? 'Simplifying...' : 'Click the "Simple" tab to get started.'}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <PairingCard />

        <Separator className="my-6" />

        <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2 font-headline">
              <Wand2 className="w-6 h-6 text-primary" />
              Recipe Remix
            </h3>
            <p className="text-muted-foreground">
              Want to make a change? Tell our AI what you'd like to do. For example: "Make it vegetarian", "Add a spicy kick", or "Remix with Japanese flavors".
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Textarea
                placeholder="Enter your remix request..."
                value={remixPrompt}
                onChange={(e) => setRemixPrompt(e.target.value)}
                className="flex-grow"
                disabled={isRemixing}
              />
              <Button onClick={handleRemixRecipe} disabled={isRemixing} className="sm:self-end">
                {isRemixing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Remix Recipe
              </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
