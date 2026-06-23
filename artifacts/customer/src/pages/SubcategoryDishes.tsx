import { Link, useParams } from "wouter";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";

type Dish = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  modelGlbUrl: string | null;
  isAvailable: boolean;
  categoryId: number | null;
};

type Subcategory = { id: number; name: string };

export default function SubcategoryDishes() {
  const params = useParams();
  const categoryId = params.categoryId;
  const subcategoryId = Number(params.subcategoryId);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [showPhotos, setShowPhotos] = useState(true);
  const [loading, setLoading] = useState(true);

  const getFallbackImage = (catId?: number | null) => {
    if (!catId) return "/placeholder-pizza.png";
    const mod = catId % 4;
    if (mod === 0) return "/placeholder-pizza.png";
    if (mod === 1) return "/placeholder-sandwich.png";
    if (mod === 2) return "/placeholder-boisson.png";
    return "/placeholder-dessert.png";
  };

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/dishes?subcategory_id=${subcategoryId}`).then((r) => r.json()),
      fetch(`${API_BASE}/api/subcategories?category_id=${categoryId}`).then((r) => r.json()),
      fetch(`${API_BASE}/api/settings`).then((r) => r.json()),
    ]).then(([dishList, subs, settings]) => {
      setDishes(Array.isArray(dishList) ? dishList : []);
      setSubcategory(subs.find((s: Subcategory) => s.id === subcategoryId) || null);
      setShowPhotos(settings.showPhotos);
      setLoading(false);
    });
  }, [subcategoryId, categoryId]);

  return (
    <div className="flex flex-col w-full min-h-screen pb-6 bg-background">
      <div className="px-6 pt-8 pb-6" style={{ borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
        <Link href={`/category/${categoryId}`} className="inline-flex items-center justify-center bg-card p-3 rounded-full border border-border tap-effect text-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-serif font-bold text-foreground">
          {subcategory?.name || "Plats"}
        </h1>
      </div>

      <div className="px-4 md:px-8 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : dishes.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            Aucun plat trouve dans cette sous-categorie.
          </div>
        ) : showPhotos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {dishes.map((dish) => (
              <Link key={dish.id} href={"/dish/" + dish.id} className="group tap-effect block">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-card" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                  <img
                    src={dish.imageUrl || getFallbackImage(dish.categoryId)}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-base leading-tight mb-1" style={{ fontFamily: "serif" }}>{dish.name}</h3>
                    <p className="text-white/50 text-xs line-clamp-1 mb-2">{dish.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-sm">{formatPrice(dish.price)}</span>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.5)" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
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
        ) : (
          <div className="max-w-3xl mx-auto divide-y divide-white/5">
            {dishes.map((dish) => (
              <Link key={dish.id} href={"/dish/" + dish.id} className="group tap-effect block">
                <div className="flex items-center justify-between gap-4 py-5 px-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-foreground font-semibold text-base" style={{ fontFamily: "serif" }}>{dish.name}</h3>
                      {dish.modelGlbUrl && dish.isAvailable && (
                        <span className="text-[10px] uppercase tracking-wide text-primary border border-primary/40 rounded-full px-2 py-0.5">3D AR</span>
                      )}
                      {!dish.isAvailable && (
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground border border-border rounded-full px-2 py-0.5">Epuise</span>
                      )}
                    </div>
                    {dish.description && (
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{dish.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-primary font-bold text-base whitespace-nowrap">{formatPrice(dish.price)}</span>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.35)" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
