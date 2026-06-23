import { Link } from 'wouter';
import { useListCategories } from '@workspace/api-client-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: categoriesRaw, isLoading: isLoadingCategories } = useListCategories();
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
      <div className="px-4 md:px-8 py-8">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Nos Categories</h2>
        {isLoadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className={cn(
                  "tap-effect block rounded-xl p-5 bg-card border border-border hover:border-primary/40 transition-colors text-center"
                )}
              >
                <h3 className="text-foreground font-semibold text-base" style={{ fontFamily: "serif" }}>
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
