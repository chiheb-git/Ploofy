import { Link, useParams } from "wouter";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";

type Subcategory = {
  id: number;
  categoryId: number;
  name: string;
  icon: string | null;
  dishCount?: number;
};

type Category = { id: number; name: string };

export default function Subcategories() {
  const params = useParams();
  const categoryId = Number(params.categoryId);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/subcategories?category_id=${categoryId}`).then((r) => r.json()),
      fetch(`${API_BASE}/api/categories`).then((r) => r.json()),
    ]).then(([subs, cats]) => {
      setSubcategories(subs);
      const catList = Array.isArray(cats) ? cats : cats?.data ?? [];
      setCategory(catList.find((c: Category) => c.id === categoryId) || null);
      setLoading(false);
    });
  }, [categoryId]);

  return (
    <div className="flex flex-col w-full min-h-screen pb-6">
      <div className="px-6 pt-8 pb-6" style={{ borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
        <Link href="/" className="inline-flex items-center justify-center bg-card p-3 rounded-full border border-border tap-effect text-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-serif font-bold text-foreground">
          {category?.name || "Categorie"}
        </h1>
      </div>

      <div className="px-4 md:px-8 py-6">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : subcategories.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            Aucune sous-categorie trouvee.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${categoryId}/${sub.id}`}
                className="tap-effect block rounded-xl p-5 bg-card border border-border hover:border-primary/40 transition-colors"
              >
                <h3 className="text-foreground font-semibold text-base" style={{ fontFamily: "serif" }}>
                  {sub.name}
                </h3>
                <p className="text-muted-foreground text-xs mt-1">{sub.dishCount || 0} plats</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

