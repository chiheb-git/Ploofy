import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, subcategoriesTable, dishesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/subcategories", async (req, res): Promise<void> => {
  const categoryId = req.query.category_id ? Number(req.query.category_id) : undefined;

  const base = db
    .select({
      id: subcategoriesTable.id,
      categoryId: subcategoriesTable.categoryId,
      name: subcategoriesTable.name,
      icon: subcategoriesTable.icon,
      sortOrder: subcategoriesTable.sortOrder,
      createdAt: subcategoriesTable.createdAt,
      dishCount: sql<number>`cast(count(${dishesTable.id}) as int)`,
    })
    .from(subcategoriesTable)
    .leftJoin(dishesTable, eq(dishesTable.subcategoryId, subcategoriesTable.id))
    .groupBy(subcategoriesTable.id)
    .orderBy(subcategoriesTable.sortOrder);

  const rows = categoryId !== undefined
    ? await base.where(eq(subcategoriesTable.categoryId, categoryId))
    : await base;

  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/subcategories", async (req, res): Promise<void> => {
  const { categoryId, name, icon, sortOrder } = req.body;
  if (!categoryId || !name) {
    res.status(400).json({ error: "categoryId and name are required" });
    return;
  }
  const [sub] = await db
    .insert(subcategoriesTable)
    .values({ categoryId: Number(categoryId), name, icon: icon ?? null, sortOrder: sortOrder ?? 0 })
    .returning();
  res.status(201).json({ ...sub, dishCount: 0, createdAt: sub.createdAt.toISOString() });
});

router.put("/subcategories/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { categoryId, name, icon, sortOrder } = req.body;
  const updateData: Partial<typeof subcategoriesTable.$inferInsert> = {};
  if (categoryId !== undefined) updateData.categoryId = Number(categoryId);
  if (name !== undefined) updateData.name = name;
  if (icon !== undefined) updateData.icon = icon;
  if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

  const [sub] = await db
    .update(subcategoriesTable)
    .set(updateData)
    .where(eq(subcategoriesTable.id, id))
    .returning();
  if (!sub) {
    res.status(404).json({ error: "Subcategory not found" });
    return;
  }
  const [{ dishCount }] = await db
    .select({ dishCount: sql<number>`cast(count(${dishesTable.id}) as int)` })
    .from(dishesTable)
    .where(eq(dishesTable.subcategoryId, sub.id));
  res.json({ ...sub, dishCount, createdAt: sub.createdAt.toISOString() });
});

router.delete("/subcategories/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const [sub] = await db
    .delete(subcategoriesTable)
    .where(eq(subcategoriesTable.id, id))
    .returning();
  if (!sub) {
    res.status(404).json({ error: "Subcategory not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
