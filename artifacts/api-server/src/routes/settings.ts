import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, settingsTable } from "@workspace/db";

const router: IRouter = Router();
const KEY = "global";

router.get("/settings", async (req, res): Promise<void> => {
  const [row] = await db.select().from(settingsTable).where(eq(settingsTable.key, KEY));
  if (!row) {
    res.json({ showPhotos: true });
    return;
  }
  res.json({ showPhotos: row.showPhotos });
});

router.put("/settings", async (req, res): Promise<void> => {
  const showPhotos = Boolean(req.body?.showPhotos);
  const [existing] = await db.select().from(settingsTable).where(eq(settingsTable.key, KEY));
  if (existing) {
    await db.update(settingsTable).set({ showPhotos }).where(eq(settingsTable.key, KEY));
  } else {
    await db.insert(settingsTable).values({ key: KEY, showPhotos });
  }
  res.json({ showPhotos });
});

export default router;
