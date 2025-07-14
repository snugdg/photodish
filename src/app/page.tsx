import { RecipeUploader } from '@/components/recipe-uploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Lightbulb, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12 animate-in fade-in-50 slide-in-from-top-4 duration-500">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 font-headline text-primary">
          From Photo to Fork
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
          Ever seen a dish so good you wished you had the recipe? Now you can.
          Just upload a picture, and let our AI chef do the rest.
        </p>
      </section>

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
                Receive a complete recipe, save it to your profile, and start your culinary adventure.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
