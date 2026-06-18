import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, categoriesTable, dishesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [{ totalDishes }] = await db
    .select({ totalDishes: sql<number>`cast(count(*) as int)` })
    .from(dishesTable);

  const [{ totalCategories }] = await db
    .select({ totalCategories: sql<number>`cast(count(*) as int)` })
    .from(categoriesTable);

  const [{ modelsCount }] = await db
    .select({
      modelsCount: sql<number>`cast(count(*) as int)`,
    })
    .from(dishesTable)
    .where(sql`${dishesTable.modelGlbUrl} IS NOT NULL AND ${dishesTable.modelGlbUrl} != ''`);

  res.json({ totalDishes, totalCategories, modelsCount });
});

export default router;
