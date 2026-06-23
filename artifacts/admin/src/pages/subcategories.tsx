import { useState, useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useSearch, Link } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const API_BASE = import.meta.env.VITE_API_URL || "";

type Subcategory = {
  id: number;
  categoryId: number;
  name: string;
  icon: string | null;
  sortOrder: number;
  dishCount?: number;
};

const subSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  icon: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
});
type SubFormValues = z.infer<typeof subSchema>;

export default function SubcategoriesPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const categoryId = Number(params.get("categoryId"));
  const categoryName = params.get("categoryName") || "";

  const queryClient = useQueryClient();
  const queryKey = ["subcategories", categoryId];

  const { data: subcategories, isLoading } = useQuery<Subcategory[]>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/subcategories?category_id=${categoryId}`);
      return res.json();
    },
    enabled: !!categoryId,
  });

  const createSub = useMutation({
    mutationFn: async (data: SubFormValues) => {
      const res = await fetch(`${API_BASE}/api/subcategories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, categoryId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Sous-categorie creee");
      handleCloseModal();
    },
    onError: () => toast.error("Erreur lors de la creation"),
  });

  const updateSub = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: SubFormValues }) => {
      const res = await fetch(`${API_BASE}/api/subcategories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Sous-categorie mise a jour");
      handleCloseModal();
    },
    onError: () => toast.error("Erreur lors de la mise a jour"),
  });

  const deleteSub = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API_BASE}/api/subcategories/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Sous-categorie supprimee");
      setDeletingSub(null);
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null);
  const [deletingSub, setDeletingSub] = useState<Subcategory | null>(null);

  const form = useForm<SubFormValues>({
    resolver: zodResolver(subSchema),
    defaultValues: { name: "", icon: "", sortOrder: 0 },
  });

  const handleOpenModal = (sub?: Subcategory) => {
    if (sub) {
      setEditingSub(sub);
      form.reset({ name: sub.name, icon: sub.icon || "", sortOrder: sub.sortOrder });
    } else {
      setEditingSub(null);
      form.reset({ name: "", icon: "", sortOrder: (subcategories?.length || 0) * 10 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingSub(null);
      form.reset();
    }, 200);
  };

  const onSubmit = (values: SubFormValues) => {
    if (editingSub) {
      updateSub.mutate({ id: editingSub.id, data: values });
    } else {
      createSub.mutate(values);
    }
  };

  const isPending = createSub.isPending || updateSub.isPending;

  return (
    <div className="py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Retour aux categories
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Sous-categories</h1>
          <p className="text-muted-foreground mt-1">Categorie : {categoryName}</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une sous-categorie
        </Button>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Icone</TableHead>
              <TableHead className="text-center">Plats</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : !subcategories || subcategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Aucune sous-categorie trouvee.
                </TableCell>
              </TableRow>
            ) : (
              subcategories.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell>{sub.icon}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center bg-secondary text-secondary-foreground rounded-full h-6 w-6 text-xs font-medium">
                      {sub.dishCount || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(sub)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10" onClick={() => setDeletingSub(sub)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSub ? "Modifier la sous-categorie" : "Ajouter une sous-categorie"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Cookies" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icone (emoji ou nom)</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: cookie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordre d'affichage</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseModal}>Annuler</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingSub ? "Enregistrer" : "Creer"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingSub} onOpenChange={(open) => !open && setDeletingSub(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Etes-vous sur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. Elle supprimera la sous-categorie "{deletingSub?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingSub && deleteSub.mutate(deletingSub.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteSub.isPending}>
              {deleteSub.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
