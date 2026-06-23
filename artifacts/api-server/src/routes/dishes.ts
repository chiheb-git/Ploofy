import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, dishesTable } from "@workspace/db";
import {
  ListDishesQueryParams,
  CreateDishBody,
  GetDishParams,
  UpdateDishParams,
  UpdateDishBody,
  DeleteDishParams,
  ToggleDishAvailabilityParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatDish(d: typeof dishesTable.$inferSelect) {
  return {
    id: d.id,
    categoryId: d.categoryId,
    subcategoryId: d.subcategoryId,
    name: d.name,
    description: d.description,
    price: d.price,
    imageUrl: d.imageUrl,
    modelGlbUrl: d.modelGlbUrl,
    isAvailable: d.isAvailable,
    sortOrder: d.sortOrder,
    createdAt: d.createdAt.toISOString(),
  };
}

router.get("/dishes", async (req, res): Promise<void> => {
  const params = ListDishesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const subcategoryId = req.query.subcategory_id ? Number(req.query.subcategory_id) : undefined;
  if (subcategoryId !== undefined) {
    const dishes = await db
      .select()
      .from(dishesTable)
      .where(eq(dishesTable.subcategoryId, subcategoryId))
      .orderBy(dishesTable.sortOrder);
    res.json(dishes.map(formatDish));
    return;
  }
  if (params.data.category_id !== undefined) {
    const dishes = await db
      .select()
      .from(dishesTable)
      .where(eq(dishesTable.categoryId, params.data.category_id))
      .orderBy(dishesTable.sortOrder);
    res.json(dishes.map(formatDish));
    return;
  }
  const dishes = await db.select().from(dishesTable).orderBy(dishesTable.sortOrder);
  res.json(dishes.map(formatDish));
});

router.get("/dishes/:id", async (req, res): Promise<void> => {
  const params = GetDishParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [dish] = await db
    .select()
    .from(dishesTable)
    .where(eq(dishesTable.id, params.data.id));
  if (!dish) {
    res.status(404).json({ error: "Dish not found" });
    return;
  }
  res.json(formatDish(dish));
});

router.post("/dishes", async (req, res): Promise<void> => {
  const parsed = CreateDishBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [dish] = await db
    .insert(dishesTable)
    .values({
      categoryId: parsed.data.categoryId ?? null,
      subcategoryId: (req.body.subcategoryId !== undefined ? Number(req.body.subcategoryId) || null : null),
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      price: parsed.data.price,
      imageUrl: parsed.data.imageUrl ?? null,
      modelGlbUrl: parsed.data.modelGlbUrl ?? null,
      isAvailable: parsed.data.isAvailable ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();
  res.status(201).json(formatDish(dish));
});

router.put("/dishes/:id", async (req, res): Promise<void> => {
  const params = UpdateDishParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateDishBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Partial<typeof dishesTable.$inferInsert> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.price !== undefined) updateData.price = parsed.data.price;
  if (parsed.data.imageUrl !== undefined) updateData.imageUrl = parsed.data.imageUrl;
  if (parsed.data.modelGlbUrl !== undefined) updateData.modelGlbUrl = parsed.data.modelGlbUrl;
  if (parsed.data.isAvailable !== undefined) updateData.isAvailable = parsed.data.isAvailable;
  if (parsed.data.sortOrder !== undefined) updateData.sortOrder = parsed.data.sortOrder;
  if ("categoryId" in parsed.data) updateData.categoryId = parsed.data.categoryId ?? null;
  if ("subcategoryId" in req.body) updateData.subcategoryId = req.body.subcategoryId ? Number(req.body.subcategoryId) : null;

  const [dish] = await db
    .update(dishesTable)
    .set(updateData)
    .where(eq(dishesTable.id, params.data.id))
    .returning();
  if (!dish) {
    res.status(404).json({ error: "Dish not found" });
    return;
  }
  res.json(formatDish(dish));
});

router.delete("/dishes/:id", async (req, res): Promise<void> => {
  const params = DeleteDishParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [dish] = await db
    .delete(dishesTable)
    .where(eq(dishesTable.id, params.data.id))
    .returning();
  if (!dish) {
    res.status(404).json({ error: "Dish not found" });
    return;
  }
  res.sendStatus(204);
});

router.patch("/dishes/:id/toggle", async (req, res): Promise<void> => {
  const params = ToggleDishAvailabilityParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [existing] = await db
    .select()
    .from(dishesTable)
    .where(eq(dishesTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Dish not found" });
    return;
  }
  const [dish] = await db
    .update(dishesTable)
    .set({ isAvailable: !existing.isAvailable })
    .where(eq(dishesTable.id, params.data.id))
    .returning();
  res.json(formatDish(dish));
});

export default router;


