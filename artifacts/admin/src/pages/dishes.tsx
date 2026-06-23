import { useState, useMemo } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
  useListDishes,
  getListDishesQueryKey,
  useListCategories,
  useCreateDish,
  useUpdateDish,
  useDeleteDish,
  useToggleDishAvailability,
  Dish
} from "@workspace/api-client-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Box } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE = import.meta.env.VITE_API_URL || "";

type Subcategory = { id: number; categoryId: number; name: string };

const dishSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  price: z.string().min(1, "Le prix est requis"),
  imageUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  modelGlbUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  categoryId: z.coerce.number().optional(),
  subcategoryId: z.coerce.number().optional(),
  isAvailable: z.boolean().default(true),
});

type DishFormValues = z.infer<typeof dishSchema>;

function useSubcategories(categoryId?: number) {
  return useQuery<Subcategory[]>({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const res = await fetch(`${API_BASE}/api/subcategories?category_id=${categoryId}`);
      return res.json();
    },
    enabled: !!categoryId,
  });
}

export default function DishesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("all");

  const categoryIdParam = activeTab === "all" ? undefined : parseInt(activeTab);
  const { data: dishes, isLoading: isLoadingDishes } = useListDishes({ category_id: categoryIdParam });
  const { data: categories } = useListCategories();

  const createDish = useCreateDish();
  const updateDish = useUpdateDish();
  const deleteDish = useDeleteDish();
  const toggleAvailability = useToggleDishAvailability();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [deletingDish, setDeletingDish] = useState<Dish | null>(null);

  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      modelGlbUrl: "",
      categoryId: undefined,
      subcategoryId: undefined,
      isAvailable: true,
    },
  });

  const selectedCategoryId = form.watch("categoryId");
  const { data: formSubcategories, isLoading: isLoadingSubs } = useSubcategories(selectedCategoryId);

  const handleOpenModal = (dish?: Dish) => {
    if (dish) {
      setEditingDish(dish);
      form.reset({
        name: dish.name,
        description: dish.description || "",
        price: dish.price,
        imageUrl: dish.imageUrl || "",
        modelGlbUrl: dish.modelGlbUrl || "",
        categoryId: dish.categoryId || undefined,
        subcategoryId: (dish as any).subcategoryId || undefined,
        isAvailable: dish.isAvailable,
      });
    } else {
      setEditingDish(null);
      form.reset({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        modelGlbUrl: "",
        categoryId: categoryIdParam || (categories?.[0]?.id),
        subcategoryId: undefined,
        isAvailable: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingDish(null);
      form.reset();
    }, 200);
  };

  const onSubmit = (values: DishFormValues) => {
    const data = {
      ...values,
      imageUrl: values.imageUrl || undefined,
      modelGlbUrl: values.modelGlbUrl || undefined,
      subcategoryId: values.subcategoryId || null,
    };

    if (editingDish) {
      updateDish.mutate(
        { id: editingDish.id, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListDishesQueryKey() });
            toast.success("Plat mis a jour");
            handleCloseModal();
          },
          onError: () => toast.error("Erreur lors de la mise a jour"),
        }
      );
    } else {
      createDish.mutate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListDishesQueryKey() });
            toast.success("Plat cree");
            handleCloseModal();
          },
          onError: () => toast.error("Erreur lors de la creation"),
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deletingDish) return;
    deleteDish.mutate(
      { id: deletingDish.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDishesQueryKey() });
          toast.success("Plat supprime");
          setDeletingDish(null);
        },
        onError: () => toast.error("Erreur lors de la suppression"),
      }
    );
  };

  const handleToggleAvailability = (dish: Dish, checked: boolean) => {
    const previousDishes = queryClient.getQueryData<Dish[]>(getListDishesQueryKey({ category_id: categoryIdParam }));
    if (previousDishes) {
      queryClient.setQueryData(
        getListDishesQueryKey({ category_id: categoryIdParam }),
        previousDishes.map(d => d.id === dish.id ? { ...d, isAvailable: checked } : d)
      );
    }
    toggleAvailability.mutate(
      { id: dish.id },
      {
        onError: () => {
          if (previousDishes) {
            queryClient.setQueryData(getListDishesQueryKey({ category_id: categoryIdParam }), previousDishes);
          }
          toast.error("Erreur lors de la modification de disponibilite");
        }
      }
    );
  };

  const isPending = createDish.isPending || updateDish.isPending;

  return (
    <div className="py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plats</h1>
          <p className="text-muted-foreground mt-1">Gerez le catalogue de vos plats.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un plat
        </Button>
      </div>

      {categories && categories.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full overflow-x-auto">
          <TabsList className="mb-4 inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-max min-w-full sm:min-w-0">
            <TabsTrigger value="all">Tous</TabsTrigger>
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id.toString()}>{cat.name}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoadingDishes ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : !dishes || dishes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground border rounded-lg bg-card">
            Aucun plat trouve dans cette categorie.
          </div>
        ) : (
          dishes.map((dish) => (
            <Card key={dish.id} className="overflow-hidden flex flex-col group">
              <div className="aspect-video w-full bg-muted relative overflow-hidden">
                {dish.imageUrl ? (
                  <img src={dish.imageUrl} alt={dish.name} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-muted-foreground/50">
                    <ImageIcon className="h-12 w-12" />
                  </div>
                )}
                {dish.modelGlbUrl && (
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium flex items-center shadow-sm">
                    <Box className="h-3 w-3 mr-1" /> 3D
                  </div>
                )}
                {!dish.isAvailable && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-sm">Indisponible</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-lg line-clamp-1" title={dish.name}>{dish.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {dish.description || "Aucune description"}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                  <div className="font-medium text-primary">{formatPrice(dish.price)}</div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={dish.isAvailable}
                      onCheckedChange={(checked) => handleToggleAvailability(dish, checked)}
                      aria-label="Toggle availability"
                    />
                    <div className="flex">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal(dish)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10" onClick={() => setDeletingDish(dish)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDish ? "Modifier le plat" : "Ajouter un plat"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du plat</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: Couscous Royal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categorie</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(parseInt(val));
                            form.setValue("subcategoryId", undefined);
                          }}
                          defaultValue={field.value?.toString()}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selectionner une categorie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subcategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sous-categorie (optionnel)</FormLabel>
                        <Select
                          onValueChange={(val) => field.onChange(val === "none" ? undefined : parseInt(val))}
                          value={field.value?.toString() || "none"}
                          disabled={!selectedCategoryId || isLoadingSubs}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Aucune sous-categorie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Aucune</SelectItem>
                            {formSubcategories?.map((sub) => (
                              <SelectItem key={sub.id} value={sub.id.toString()}>
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix (DZD)</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: 1200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Disponible</FormLabel>
                          <div className="text-[0.8rem] text-muted-foreground">
                            Afficher ce plat dans le menu client
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description des ingredients..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => {
                      const [uploading, setUploading] = useState(false);
                      const [preview, setPreview] = useState<string | null>(field.value || null);
                      const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
                      const [urlInput, setUrlInput] = useState(field.value || "");

                      const handleFile = async (file?: File) => {
                        if (!file) return;
                        setUploading(true);
                        try {
                          const fd = new FormData();
                          fd.append("file", file);
                          const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, { method: "POST", body: fd });
                          const json = await resp.json();
                          if (resp.ok && json.url) {
                            field.onChange(json.url);
                            setPreview(json.url);
                          } else {
                            console.error(json);
                          }
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setUploading(false);
                        }
                      };

                      const handleUrlConfirm = () => {
                        field.onChange(urlInput);
                        setPreview(urlInput || null);
                      };

                      const handleClear = () => {
                        field.onChange("");
                        setPreview(null);
                        setUrlInput("");
                      };

                      return (
                        <FormItem>
                          <FormLabel>Image du plat</FormLabel>
                          <FormControl>
                            <div className="border rounded-md overflow-hidden">
                              <div className="flex border-b">
                                <button
                                  type="button"
                                  onClick={() => setImageMode("upload")}
                                  className={`flex-1 py-2 text-sm font-medium transition-colors ${imageMode === "upload" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                                >
                                  Galerie
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setImageMode("url")}
                                  className={`flex-1 py-2 text-sm font-medium transition-colors ${imageMode === "url" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                                >
                                  Lien URL
                                </button>
                              </div>

                              <div className="p-3 space-y-3">
                                {preview && (
                                  <div className="relative w-full h-32 rounded-md overflow-hidden bg-muted">
                                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={handleClear}
                                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                                    >x</button>
                                  </div>
                                )}

                                {imageMode === "upload" ? (
                                  <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer?.files?.[0]; if (f) handleFile(f); }}
                                    className="border-dashed border-2 border-border rounded-md p-3 text-center"
                                  >
                                    <div className="text-sm text-muted-foreground mb-2">Glissez une image ici ou</div>
                                    <div className="flex items-center justify-center gap-2">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        id="dish-image-input"
                                        className="hidden"
                                        onChange={(e) => handleFile(e.target.files?.[0])}
                                      />
                                      <label htmlFor="dish-image-input" className="cursor-pointer inline-flex items-center px-3 py-1.5 border rounded-md text-sm hover:bg-muted transition-colors">
                                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                        Parcourir
                                      </label>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="text-xs text-muted-foreground">Coller un lien direct vers l image (Google Drive, Imgur, etc.)</div>
                                    <div className="flex gap-2">
                                      <Input
                                        placeholder="https://..."
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleUrlConfirm(); } }}
                                        className="text-sm"
                                      />
                                      <Button type="button" size="sm" onClick={handleUrlConfirm}>OK</Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="modelGlbUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL du modele 3D (.glb) (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Alert className="bg-muted/50 text-muted-foreground">
                <Box className="h-4 w-4" />
                <AlertDescription className="text-xs ml-2">
                  <p className="font-semibold mb-1">Comment obtenir le fichier .glb :</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Photo du plat - Meshy.ai (Image to 3D)</li>
                    <li>Amelioration - Luma AI</li>
                    <li>Retexture IA - Blender + Dream Textures</li>
                    <li>Export - glTF 2.0 + compression Draco</li>
                    <li>Heberger le .glb et coller l URL ici</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCloseModal}>Annuler</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingDish ? "Enregistrer" : "Creer"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingDish} onOpenChange={(open) => !open && setDeletingDish(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Etes-vous sur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. Elle supprimera le plat "{deletingDish?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteDish.isPending}>
              {deleteDish.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
