import { Link, useParams } from "wouter";
import { ArrowLeft, Box } from "lucide-react";
import { useGetDish, getGetDishQueryKey } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function DishDetail() {
  const params = useParams();
  const id = Number(params.id);

  const { data: dish, isLoading } = useGetDish(id, {
    query: { enabled: !!id, queryKey: getGetDishQueryKey(id) }
  });

  const getFallbackImage = (categoryId?: number | null) => {
    if (!categoryId) return "/placeholder-pizza.png";
    const mod = categoryId % 4;
    if (mod === 0) return "/placeholder-pizza.png";
    if (mod === 1) return "/placeholder-sandwich.png";
    if (mod === 2) return "/placeholder-boisson.png";
    return "/placeholder-dessert.png";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Skeleton className="w-full h-[300px] rounded-none" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-serif mb-2">Plat introuvable</h2>
        <Link href="/" className="text-primary mt-4 py-2 px-4 rounded border border-primary tap-effect">
          Retour au menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative pb-32">
      {/* Hero Image */}
      <div className="relative w-full h-[350px] bg-card">
        <img 
          src={dish.imageUrl || getFallbackImage(dish.categoryId)} 
          alt={dish.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Back Button */}
        <Link href="/" className="absolute top-6 left-4 bg-background/40 backdrop-blur-md p-3 rounded-full border border-white/10 tap-effect text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 relative z-10">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h1 className="text-3xl font-serif font-bold text-foreground leading-tight flex-1">
            {dish.name}
          </h1>
        </div>

        <div className="inline-block bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full font-semibold text-lg mb-6">
          {formatPrice(dish.price)}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-3">Description</h3>
            <p className="text-foreground/90 leading-relaxed text-base">
              {dish.description || "Une délicieuse spécialité préparée avec soin et des ingrédients de première qualité, sélectionnée par notre chef."}
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none z-40">
        <div className="max-w-md mx-auto pointer-events-auto">
          {dish.modelGlbUrl ? (
            <Link 
              href={`/ar/${dish.id}`}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-accent text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg tap-effect"
            >
              <Box className="w-5 h-5" />
              Voir en 3D / AR
            </Link>
          ) : (
            <div className="w-full flex items-center justify-center py-4 rounded-xl bg-card border border-border text-muted-foreground font-medium">
              Aperçu 3D non disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
