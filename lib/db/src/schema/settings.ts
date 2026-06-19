import { pgTable, varchar, boolean } from "drizzle-orm/pg-core";

export const settingsTable = pgTable("settings", {
  key: varchar("key", { length: 50 }).primaryKey(),
  showPhotos: boolean("show_photos").default(true).notNull(),
});

export type Settings = typeof settingsTable.$inferSelect;
