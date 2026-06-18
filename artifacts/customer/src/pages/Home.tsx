import { useState } from 'react';
import { Link } from 'wouter';
import { useListCategories, useListDishes } from '@workspace/api-client-react';
import { formatPrice, cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const { data: categoriesRaw, isLoading: isLoadingCategories } = useListCategories();
  const { data: dishesRaw, isLoading: isLoadingDishes } = useListDishes(
    activeCategory ? { category_id: activeCategory } : {}
  );

  const getFallbackImage = (categoryId?: number | null) => {
    if (!categoryId) return '/placeholder-pizza.png';
    const mod = categoryId % 4;
    if (mod === 0) return '/placeholder-pizza.png';
    if (mod === 1) return '/placeholder-sandwich.png';
    if (mod === 2) return '/placeholder-boisson.png';
    return '/placeholder-dessert.png';
  };

  const dishes = Array.isArray(dishesRaw) ? dishesRaw : dishesRaw?.data ?? [];
  const categories = Array.isArray(categoriesRaw) ? categoriesRaw : categoriesRaw?.data ?? [];

  return (
    <div className="flex flex-col w-full min-h-screen pb-6">

      {/* Hero */}
      <section className="relative w-full flex flex-col items-center justify-center border-b border-border overflow-hidden" style={{minHeight:"320px"}}>
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" style={{filter:"brightness(0.35)"}}>
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 text-center px-6">

        </div>
      </section>

      {/* Categories */}
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/5 py-4" style={{background:"rgba(10,10,10,0.9)"}}>
        <div className="flex overflow-x-auto px-6 gap-3 no-scrollbar" style={{scrollbarWidth:"none"}}>
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all tap-effect",
              activeCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border"
            )}
          >
            Tous
          </button>
          {isLoadingCategories ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full flex-shrink-0" />
            ))
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all tap-effect",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border"
                )}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Dishes */}
      <div className="px-4 md:px-8 py-6">
        {isLoadingDishes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="w-full aspect-[4/3] rounded-xl" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            ))}
          </div>
        ) : dishes.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            Aucun plat trouve dans cette categorie.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {dishes.map((dish) => (
              <Link key={dish.id} href={"/dish/" + dish.id} className="group tap-effect block">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-card" style={{boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
                  <img
                    src={dish.imageUrl || getFallbackImage(dish.categoryId)}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{background:"linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)"}} />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-base leading-tight mb-1" style={{fontFamily:"serif"}}>{dish.name}</h3>
                    <p className="text-white/50 text-xs line-clamp-1 mb-2">{dish.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-sm">{formatPrice(dish.price)}</span>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{background:"rgba(201,168,76,0.2)",border:"1px solid rgba(201,168,76,0.5)"}}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                      </div>
                    </div>
                  </div>
                  {!dish.isAvailable && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="bg-card px-4 py-2 rounded-full text-sm font-medium border border-border">Epuise</span>
                    </div>
                  )}
                  {dish.modelGlbUrl && dish.isAvailable && (
                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-border flex items-center gap-1.5 text-primary">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      3D AR
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
