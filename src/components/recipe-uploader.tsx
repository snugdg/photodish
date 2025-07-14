'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { generateRecipeFromPhoto, GenerateRecipeFromPhotoOutput } from '@/ai/flows/generate-recipe-from-photo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import { RecipeDisplay } from './recipe-display';
import { cn } from '@/lib/utils';

export function RecipeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<GenerateRecipeFromPhotoOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setRecipe(null); // Reset recipe when new file is selected
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
      setRecipe(null);
    }
  };
  
  const handleDragEvents = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image of a dish first.',
      });
      return;
    }
    setLoading(true);
    setRecipe(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const photoDataUri = reader.result as string;
        const result = await generateRecipeFromPhoto({ photoDataUri });
        setRecipe(result);
      };
      reader.onerror = (error) => {
        throw new Error("Failed to read file");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your recipe. Please try another image.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg animate-in fade-in-50 duration-500">
      <CardContent className="p-6">
        <div
          className={cn(
            "border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging ? 'bg-accent/20 border-accent' : 'hover:bg-accent/10'
          )}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragEnter={handleDragEvents}
          onDragOver={handleDragEvents}
          onDragLeave={handleDragEvents}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <div className="flex flex-col items-center justify-center space-y-4">
            {previewUrl ? (
              <Image src={previewUrl} alt="Dish preview" width={200} height={200} className="rounded-lg object-cover max-h-48" />
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  <span className="font-semibold text-accent">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
              </>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Button onClick={handleSubmit} disabled={!file || loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              'Generate Recipe'
            )}
          </Button>
        </div>
        {recipe && previewUrl && (
          <div className="mt-8">
            <RecipeDisplay initialRecipe={recipe.recipe} photoUrl={previewUrl} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
