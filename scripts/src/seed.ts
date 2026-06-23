import { db, categoriesTable, subcategoriesTable, dishesTable } from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  await db.delete(dishesTable);
  await db.delete(subcategoriesTable);
  await db.delete(categoriesTable);

  const categories = await db
    .insert(categoriesTable)
    .values([
      { name: "Crepes & Gaufres", icon: "🥞", sortOrder: 1 },
      { name: "Ploffines", icon: "🍯", sortOrder: 2 },
      { name: "Pancakes", icon: "🥞", sortOrder: 3 },
      { name: "Douceurs & Gateaux", icon: "🍰", sortOrder: 4 },
      { name: "Sundae", icon: "🍨", sortOrder: 5 },
      { name: "Boissons Fraiches", icon: "🥤", sortOrder: 6 },
      { name: "Boissons Chaudes", icon: "☕", sortOrder: 7 },
    ])
    .returning();

  const cat = Object.fromEntries(categories.map(c => [c.name, c.id]));

  const subs = await db
    .insert(subcategoriesTable)
    .values([
      { categoryId: cat["Crepes & Gaufres"], name: "Crepes Sucrees", icon: "🥞", sortOrder: 1 },
      { categoryId: cat["Crepes & Gaufres"], name: "Crepes Salees", icon: "🥞", sortOrder: 2 },
      { categoryId: cat["Crepes & Gaufres"], name: "Crepes Premium", icon: "✨", sortOrder: 3 },
      { categoryId: cat["Crepes & Gaufres"], name: "Gaufres", icon: "🧇", sortOrder: 4 },

      { categoryId: cat["Ploffines"], name: "Ploffines Sucrees", icon: "🍯", sortOrder: 1 },
      { categoryId: cat["Ploffines"], name: "Ploffines Salees", icon: "🧀", sortOrder: 2 },

      { categoryId: cat["Pancakes"], name: "Pancakes", icon: "🥞", sortOrder: 1 },

      { categoryId: cat["Douceurs & Gateaux"], name: "Cheesecakes", icon: "🍰", sortOrder: 1 },
      { categoryId: cat["Douceurs & Gateaux"], name: "Cookies", icon: "🍪", sortOrder: 2 },
      { categoryId: cat["Douceurs & Gateaux"], name: "Fondant & Chtouta", icon: "🍫", sortOrder: 3 },
      { categoryId: cat["Douceurs & Gateaux"], name: "Brownie Gourmand", icon: "🍫", sortOrder: 4 },
      { categoryId: cat["Douceurs & Gateaux"], name: "Brownie Bowl", icon: "🍫", sortOrder: 5 },

      { categoryId: cat["Sundae"], name: "Formats", icon: "🍨", sortOrder: 1 },
      { categoryId: cat["Sundae"], name: "Supplements & Toppings", icon: "🍬", sortOrder: 2 },
      { categoryId: cat["Sundae"], name: "Signatures", icon: "🍨", sortOrder: 3 },

      { categoryId: cat["Boissons Fraiches"], name: "Frappes", icon: "🥤", sortOrder: 1 },
      { categoryId: cat["Boissons Fraiches"], name: "Frappes Signature", icon: "🥤", sortOrder: 2 },
      { categoryId: cat["Boissons Fraiches"], name: "Frappuccino", icon: "☕", sortOrder: 3 },
      { categoryId: cat["Boissons Fraiches"], name: "Jus Presses", icon: "🍊", sortOrder: 4 },
      { categoryId: cat["Boissons Fraiches"], name: "Smoothies", icon: "🍓", sortOrder: 5 },
      { categoryId: cat["Boissons Fraiches"], name: "Mojitos & Diabolo", icon: "🍹", sortOrder: 6 },

      { categoryId: cat["Boissons Chaudes"], name: "Chaudes", icon: "☕", sortOrder: 1 },
      { categoryId: cat["Boissons Chaudes"], name: "Iced Coffee", icon: "🧊", sortOrder: 2 },
    ])
    .returning();

  const sub = Object.fromEntries(subs.map(s => [s.name, s.id]));
  const cId = (subName: string) => subs.find(s => s.name === subName)?.categoryId;

  const placeholders = [
    "/placeholder-pizza.png",
    "/placeholder-sandwich.png",
    "/placeholder-boisson.png",
    "/placeholder-dessert.png",
  ];
  const img = (i: number) => placeholders[i % placeholders.length];

  await db.insert(dishesTable).values([
    // Crepes Sucrees
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe Nutella", description: "Crepe artisanale au Nutella.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe Chocolat", description: "Crepe artisanale au chocolat.", price: "300", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe Nutella Banane", description: "Crepe artisanale au Nutella et banane.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe Nutella Bueno", description: "Crepe artisanale au Nutella et Kinder Bueno.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe Chocolat Banane", description: "Crepe artisanale au chocolat et banane.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe Caramel Beurre Sale", description: "Crepe artisanale au caramel beurre sale.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe Chocolat Oreo", description: "Crepe artisanale au chocolat et Oreo.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe 3 Chocolats", description: "Crepe artisanale aux trois chocolats.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 8 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe aux Fruits", description: "2 fruits avec sirop d'erable.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 9 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe Bueno", description: "Sauce Bueno + Kinder Bueno.", price: "700", imageUrl: img(3), isAvailable: true, sortOrder: 10 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe Pistache", description: "Sauce pistache + croquant pistache.", price: "750", imageUrl: img(3), isAvailable: true, sortOrder: 11 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe Gourmande", description: "Sauce Kinder chocolat + glace.", price: "800", imageUrl: img(3), isAvailable: true, sortOrder: 12 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe Plöofy", description: "Melange de fruits + 3 chocolats + chantilly.", price: "1000", imageUrl: img(3), isAvailable: true, sortOrder: 13 },
    { categoryId: cId("Crepes Sucrees"), subcategoryId: sub["Crepes Sucrees"], name: "Crepe Nature ou Sucre", description: "Crepe nature ou avec sucre.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 14 },

    // Crepes Salees
    { categoryId: cId("Crepes Salees"), subcategoryId: sub["Crepes Salees"], name: "Crepe Fromage", description: "Crepe garnie de fromage.", price: "300", imageUrl: img(0), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Crepes Salees"), subcategoryId: sub["Crepes Salees"], name: "Crepe Thon", description: "Crepe garnie de thon.", price: "350", imageUrl: img(0), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Crepes Salees"), subcategoryId: sub["Crepes Salees"], name: "Crepe Poulet", description: "Crepe garnie de poulet.", price: "450", imageUrl: img(0), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Crepes Salees"), subcategoryId: sub["Crepes Salees"], name: "Crepe Poulet Pane", description: "Crepe garnie de poulet pane.", price: "500", imageUrl: img(0), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Crepes Salees"), subcategoryId: sub["Crepes Salees"], name: "Crepe 4 Fromages", description: "Melange de quatre fromages.", price: "400", imageUrl: img(0), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Crepes Salees"), subcategoryId: sub["Crepes Salees"], name: "Crepe Mixte", description: "Garniture mixte.", price: "550", imageUrl: img(0), isAvailable: true, sortOrder: 6 },

    // Crepes Premium
    { categoryId: cId("Crepes Premium"), subcategoryId: sub["Crepes Premium"], name: "Kinder", description: "Crepe fourree au brownie, fruits, creme fouettee, croquant Oreo, chocolat blanc.", price: "900", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Crepes Premium"), subcategoryId: sub["Crepes Premium"], name: "Lotus", description: "Crepe fourree au brownie, fruits, creme fouettee, croquant Speculoos, chocolat blanc.", price: "1000", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Crepes Premium"), subcategoryId: sub["Crepes Premium"], name: "Pistache", description: "Crepe fourree au brownie, fruits, creme fouettee, croquant pistache, chocolat noisette.", price: "1100", imageUrl: img(3), isAvailable: true, sortOrder: 3 },

    // Gaufres
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre Nutella", description: "Gaufre au Nutella.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre Chocolat", description: "Gaufre au chocolat.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre Nutella Banane", description: "Gaufre au Nutella et banane.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre Nutella Bueno", description: "Gaufre au Nutella et Kinder Bueno.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre Chocolat Banane", description: "Gaufre au chocolat et banane.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre Caramel Beurre Sale", description: "Gaufre au caramel beurre sale.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre Chocolat + Speculoos", description: "Gaufre au chocolat et Speculoos.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre Chocolat + Chantilly", description: "Gaufre au chocolat avec chantilly.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 8 },
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre O'Fruits", description: "2 fruits + Nutella.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 9 },
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre Pistache", description: "Sauce pistache + croquant pistache.", price: "800", imageUrl: img(3), isAvailable: true, sortOrder: 10 },
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre Gourmande", description: "Caramel beurre sale + glace + fruit.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 11 },
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre Plöofy", description: "Melange de fruits + 3 chocolats + glace.", price: "1000", imageUrl: img(3), isAvailable: true, sortOrder: 12 },
    { categoryId: cId("Gaufres"), subcategoryId: sub["Gaufres"], name: "Gaufre Nature ou Sucre", description: "Gaufre nature ou avec sucre.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 13 },

    // Ploffines Sucrees
    { categoryId: cId("Ploffines Sucrees"), subcategoryId: sub["Ploffines Sucrees"], name: "Ploffine Chocolat", description: "Ploffine au chocolat.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Ploffines Sucrees"), subcategoryId: sub["Ploffines Sucrees"], name: "Ploffine Nutella", description: "Ploffine au Nutella.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Ploffines Sucrees"), subcategoryId: sub["Ploffines Sucrees"], name: "Ploffine Caramel Beurre Sale", description: "Ploffine au caramel beurre sale.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Ploffines Sucrees"), subcategoryId: sub["Ploffines Sucrees"], name: "Ploffine Chocolat Oreo", description: "Ploffine chocolat Oreo.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Ploffines Sucrees"), subcategoryId: sub["Ploffines Sucrees"], name: "Ploffine Nutella Banane", description: "Ploffine Nutella banane.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Ploffines Sucrees"), subcategoryId: sub["Ploffines Sucrees"], name: "Ploffine Lotus", description: "Ploffine Lotus.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Ploffines Sucrees"), subcategoryId: sub["Ploffines Sucrees"], name: "Ploffine 3 Chocolats", description: "Ploffine aux trois chocolats.", price: "700", imageUrl: img(3), isAvailable: true, sortOrder: 7 },

    // Ploffines Salees
    { categoryId: cId("Ploffines Salees"), subcategoryId: sub["Ploffines Salees"], name: "Ploffine Poulet", description: "Ploffine au poulet.", price: "350", imageUrl: img(0), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Ploffines Salees"), subcategoryId: sub["Ploffines Salees"], name: "Ploffine Thon", description: "Ploffine au thon.", price: "350", imageUrl: img(0), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Ploffines Salees"), subcategoryId: sub["Ploffines Salees"], name: "Ploffine Legumes", description: "Ploffine aux legumes.", price: "300", imageUrl: img(0), isAvailable: true, sortOrder: 3 },

    // Pancakes
    { categoryId: cId("Pancakes"), subcategoryId: sub["Pancakes"], name: "Pancakes Nutella", description: "Pancakes au Nutella.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Pancakes"), subcategoryId: sub["Pancakes"], name: "Pancakes Chocolat", description: "Pancakes au chocolat.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Pancakes"), subcategoryId: sub["Pancakes"], name: "Pancakes Nutella Banane", description: "Pancakes Nutella banane.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Pancakes"), subcategoryId: sub["Pancakes"], name: "Pancakes Nutella Bueno", description: "Pancakes Nutella Kinder Bueno.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Pancakes"), subcategoryId: sub["Pancakes"], name: "Pancakes Chocolat Banane", description: "Pancakes chocolat banane.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Pancakes"), subcategoryId: sub["Pancakes"], name: "Pancakes Caramel Beurre Sale", description: "Pancakes caramel beurre sale.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Pancakes"), subcategoryId: sub["Pancakes"], name: "Pancakes Canadien", description: "Pancakes avec sirop d'erable.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Pancakes"), subcategoryId: sub["Pancakes"], name: "Pancakes Orella", description: "Chocolat + Oreo.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 8 },
    { categoryId: cId("Pancakes"), subcategoryId: sub["Pancakes"], name: "Pancakes Pistache", description: "Sauce pistache + feuilletine.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 9 },
    { categoryId: cId("Pancakes"), subcategoryId: sub["Pancakes"], name: "Pancakes Gourmande", description: "Sauce Bueno + glace.", price: "700", imageUrl: img(3), isAvailable: true, sortOrder: 10 },
    { categoryId: cId("Pancakes"), subcategoryId: sub["Pancakes"], name: "Pancakes Plöofy", description: "Melange de fruits + 3 chocolats + chantilly.", price: "1000", imageUrl: img(3), isAvailable: true, sortOrder: 11 },
    { categoryId: cId("Pancakes"), subcategoryId: sub["Pancakes"], name: "Pancakes Nature ou Sucre", description: "Pancakes nature ou avec sucre.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 12 },

    // Cheesecakes
    { categoryId: cId("Cheesecakes"), subcategoryId: sub["Cheesecakes"], name: "Cheesecake Kinder Bueno", description: "Cheesecake saveur Kinder Bueno.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Cheesecakes"), subcategoryId: sub["Cheesecakes"], name: "Cheesecake Nutella", description: "Cheesecake saveur Nutella.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Cheesecakes"), subcategoryId: sub["Cheesecakes"], name: "Cheesecake Pistache", description: "Cheesecake saveur pistache.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Cheesecakes"), subcategoryId: sub["Cheesecakes"], name: "Cheesecake Lotus", description: "Cheesecake saveur Lotus.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Cheesecakes"), subcategoryId: sub["Cheesecakes"], name: "Cheesecake Chocolat", description: "Cheesecake saveur chocolat.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Cheesecakes"), subcategoryId: sub["Cheesecakes"], name: "Cheesecake Framboise", description: "Cheesecake saveur framboise.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 6 },

    // Cookies
    { categoryId: cId("Cookies"), subcategoryId: sub["Cookies"], name: "Cookie Geant", description: "Cookie geant servi avec supplements au choix.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Cookies"), subcategoryId: sub["Cookies"], name: "Cookie Speculoos", description: "Cookie saveur Speculoos.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Cookies"), subcategoryId: sub["Cookies"], name: "Cookie Pistache", description: "Cookie saveur Pistache.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Cookies"), subcategoryId: sub["Cookies"], name: "Cookie Chocolat Noix", description: "Cookie chocolat noix.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Cookies"), subcategoryId: sub["Cookies"], name: "Cookie Kit Kat", description: "Cookie saveur Kit Kat.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Cookies"), subcategoryId: sub["Cookies"], name: "Cookie Caramel Noisette", description: "Cookie caramel noisette.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Cookies"), subcategoryId: sub["Cookies"], name: "Cookie 3 Chocolats", description: "Cookie aux trois chocolats.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Cookies"), subcategoryId: sub["Cookies"], name: "Cookie Chocolat Noir", description: "Cookie chocolat noir.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 8 },
    { categoryId: cId("Cookies"), subcategoryId: sub["Cookies"], name: "Cookie Oreo", description: "Cookie saveur Oreo.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 9 },

    // Fondant & Chtouta
    { categoryId: cId("Fondant & Chtouta"), subcategoryId: sub["Fondant & Chtouta"], name: "Fondant Chocolat", description: "Fondant au chocolat.", price: "300", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Fondant & Chtouta"), subcategoryId: sub["Fondant & Chtouta"], name: "Chtouta Chocolat", description: "Chtouta au chocolat.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Fondant & Chtouta"), subcategoryId: sub["Fondant & Chtouta"], name: "Chtouta Chocolat + Moukassarat", description: "Chocolat avec fruits secs.", price: "700", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Fondant & Chtouta"), subcategoryId: sub["Fondant & Chtouta"], name: "Chtouta Bueno + Noisette", description: "Bueno avec noisette.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Fondant & Chtouta"), subcategoryId: sub["Fondant & Chtouta"], name: "Chtouta Chocolat + Fruit", description: "Chocolat avec fruits.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Fondant & Chtouta"), subcategoryId: sub["Fondant & Chtouta"], name: "Chtouta Pistache", description: "Chtouta a la pistache.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Fondant & Chtouta"), subcategoryId: sub["Fondant & Chtouta"], name: "Chtouta Caramel + Banane", description: "Caramel avec banane.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Fondant & Chtouta"), subcategoryId: sub["Fondant & Chtouta"], name: "Chtouta Chocolat + Noisette", description: "Chocolat avec noisette.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 8 },
    { categoryId: cId("Fondant & Chtouta"), subcategoryId: sub["Fondant & Chtouta"], name: "Chtouta Caramel", description: "Chtouta au caramel.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 9 },

    // Brownie Gourmand
    { categoryId: cId("Brownie Gourmand"), subcategoryId: sub["Brownie Gourmand"], name: "Brownie Oreo", description: "Brownies fourre avec de la creme fouettee, deux chocolats (lait, blanc), Oreo.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Brownie Gourmand"), subcategoryId: sub["Brownie Gourmand"], name: "Brownie Pistache", description: "Brownies fourre avec de la creme fouettee, deux chocolats (pistache, blanc), pistache.", price: "750", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Brownie Gourmand"), subcategoryId: sub["Brownie Gourmand"], name: "Brownie Kinder", description: "Brownies fourre avec de la creme fouettee, deux chocolats (lait, blanc), Kinder.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Brownie Gourmand"), subcategoryId: sub["Brownie Gourmand"], name: "Brownie Aux Fruits", description: "Brownies fourre avec de la creme fouettee, deux chocolats (lait, blanc), fruits.", price: "700", imageUrl: img(3), isAvailable: true, sortOrder: 4 },

    // Brownie Bowl
    { categoryId: cId("Brownie Bowl"), subcategoryId: sub["Brownie Bowl"], name: "Brownie 2 Chocolats", description: "Brownies, chocolat noisette, chocolat blanc.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Brownie Bowl"), subcategoryId: sub["Brownie Bowl"], name: "Brownie Yummy", description: "Brownies, chocolat, glace.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Brownie Bowl"), subcategoryId: sub["Brownie Bowl"], name: "Brownie Le Parfait", description: "Brownies, chantilly, banane, caramel beurre sale.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 3 },

    // Sundae Formats
    { categoryId: cId("Formats"), subcategoryId: sub["Formats"], name: "Sundae S", description: "Glace sundae format Small.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Formats"), subcategoryId: sub["Formats"], name: "Sundae M", description: "Glace sundae format Medium.", price: "250", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Formats"), subcategoryId: sub["Formats"], name: "Sundae XL", description: "Glace sundae format XL.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 3 },

    // Sundae Supplements & Toppings
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Supplement Croquant", description: "M&M's, Kinder Bueno, Snickers, Mars, Oreo, Lotus, Lion, KitKat.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping Fraise", description: "Topping fraise.", price: "100", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping Chocolat", description: "Topping chocolat.", price: "100", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping Caramel", description: "Topping caramel.", price: "100", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping Nutella", description: "Topping Nutella.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping Framboise", description: "Topping framboise.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping Mangue", description: "Topping mangue.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping Ferrero Rocher", description: "Topping Ferrero Rocher.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 8 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping Caramel Crispy", description: "Topping caramel crispy.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 9 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping Raffaello", description: "Topping Raffaello.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 10 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping Bounty", description: "Topping Bounty.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 11 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping KitKat", description: "Topping KitKat.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 12 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping Caramel Beurre Sale", description: "Topping caramel beurre sale.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 13 },
    { categoryId: cId("Supplements & Toppings"), subcategoryId: sub["Supplements & Toppings"], name: "Topping Bueno White", description: "Topping Kinder Bueno White.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 14 },

    // Sundae Signatures
    { categoryId: cId("Signatures"), subcategoryId: sub["Signatures"], name: "Caramel M&M's", description: "Sundae signature au caramel et M&M's.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Signatures"), subcategoryId: sub["Signatures"], name: "Tropical", description: "Sundae signature aux fruits tropicaux.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Signatures"), subcategoryId: sub["Signatures"], name: "Full Bueno", description: "Sundae signature Kinder Bueno.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Signatures"), subcategoryId: sub["Signatures"], name: "Caramel-Cookies", description: "Sundae signature caramel et cookies.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Signatures"), subcategoryId: sub["Signatures"], name: "Pistache Signature", description: "Sundae signature a la pistache.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Signatures"), subcategoryId: sub["Signatures"], name: "Lotus Signature", description: "Sundae signature Lotus.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Signatures"), subcategoryId: sub["Signatures"], name: "Chocolat-KitKat", description: "Sundae signature chocolat et KitKat.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Signatures"), subcategoryId: sub["Signatures"], name: "Oreo-Caramel BS", description: "Sundae signature Oreo et caramel beurre sale.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 8 },

    // Frappes
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Chocolat Petit", description: "Frappe au chocolat.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Chocolat Grand", description: "Frappe au chocolat.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Oreo Petit", description: "Frappe Oreo.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Oreo Grand", description: "Frappe Oreo.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Bounty Petit", description: "Frappe Bounty.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Bounty Grand", description: "Frappe Bounty.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Kinder Petit", description: "Frappe Kinder.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Kinder Grand", description: "Frappe Kinder.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 8 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Speculoos Petit", description: "Frappe Speculoos.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 9 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Speculoos Grand", description: "Frappe Speculoos.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 10 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Rafaello Petit", description: "Frappe Rafaello.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 11 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Rafaello Grand", description: "Frappe Rafaello.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 12 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Banane Petit", description: "Frappe banane.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 13 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Banane Grand", description: "Frappe banane.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 14 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Oreo-Banane Petit", description: "Frappe Oreo et banane.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 15 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Oreo-Banane Grand", description: "Frappe Oreo et banane.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 16 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Nutella Petit", description: "Frappe Nutella.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 17 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Nutella Grand", description: "Frappe Nutella.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 18 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Snickers Petit", description: "Frappe Snickers.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 19 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Snickers Grand", description: "Frappe Snickers.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 20 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Fraise-Banane Petit", description: "Frappe fraise et banane.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 21 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Fraise-Banane Grand", description: "Frappe fraise et banane.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 22 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Citron Petit", description: "Frappe citron.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 23 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Citron Grand", description: "Frappe citron.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 24 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Chocolat-Banane Petit", description: "Frappe chocolat et banane.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 25 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Chocolat-Banane Grand", description: "Frappe chocolat et banane.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 26 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe KitKat Petit", description: "Frappe KitKat.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 27 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe KitKat Grand", description: "Frappe KitKat.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 28 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Caramel BS Petit", description: "Frappe caramel beurre sale.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 29 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Caramel BS Grand", description: "Frappe caramel beurre sale.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 30 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Mangue Petit", description: "Frappe mangue.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 31 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Mangue Grand", description: "Frappe mangue.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 32 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Framboise Petit", description: "Frappe framboise.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 33 },
    { categoryId: cId("Frappes"), subcategoryId: sub["Frappes"], name: "Frappe Framboise Grand", description: "Frappe framboise.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 34 },

    // Frappes Signature
    { categoryId: cId("Frappes Signature"), subcategoryId: sub["Frappes Signature"], name: "Pistach Petit", description: "Frappe signature a la pistache.", price: "650", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Frappes Signature"), subcategoryId: sub["Frappes Signature"], name: "Pistach Grand", description: "Frappe signature a la pistache.", price: "800", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Frappes Signature"), subcategoryId: sub["Frappes Signature"], name: "Fruits des Bois Petit", description: "Frappe signature fruits des bois.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Frappes Signature"), subcategoryId: sub["Frappes Signature"], name: "Fruits des Bois Grand", description: "Frappe signature fruits des bois.", price: "700", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Frappes Signature"), subcategoryId: sub["Frappes Signature"], name: "Ferrero Rocher Petit", description: "Frappe signature Ferrero Rocher.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Frappes Signature"), subcategoryId: sub["Frappes Signature"], name: "Ferrero Rocher Grand", description: "Frappe signature Ferrero Rocher.", price: "750", imageUrl: img(2), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Frappes Signature"), subcategoryId: sub["Frappes Signature"], name: "Caramel Crispy Petit", description: "Frappe signature caramel crispy.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Frappes Signature"), subcategoryId: sub["Frappes Signature"], name: "Caramel Crispy Grand", description: "Frappe signature caramel crispy.", price: "750", imageUrl: img(2), isAvailable: true, sortOrder: 8 },

    // Frappuccino
    { categoryId: cId("Frappuccino"), subcategoryId: sub["Frappuccino"], name: "Vanille", description: "Frappuccino vanille.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Frappuccino"), subcategoryId: sub["Frappuccino"], name: "Choco-Chip", description: "Frappuccino aux pepites de chocolat.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Frappuccino"), subcategoryId: sub["Frappuccino"], name: "Caramel", description: "Frappuccino caramel.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Frappuccino"), subcategoryId: sub["Frappuccino"], name: "Cafe", description: "Frappuccino cafe.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Frappuccino"), subcategoryId: sub["Frappuccino"], name: "Fraise", description: "Frappuccino fraise.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Frappuccino"), subcategoryId: sub["Frappuccino"], name: "Cookies", description: "Frappuccino cookies.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Frappuccino"), subcategoryId: sub["Frappuccino"], name: "Noisette", description: "Frappuccino noisette.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Frappuccino"), subcategoryId: sub["Frappuccino"], name: "Brownies", description: "Frappuccino brownies.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 8 },

    // Jus Presses
    { categoryId: cId("Jus Presses"), subcategoryId: sub["Jus Presses"], name: "Jus Cocktail", description: "Melange de fruits frais.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Jus Presses"), subcategoryId: sub["Jus Presses"], name: "Jus Banane", description: "Jus de banane frais.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Jus Presses"), subcategoryId: sub["Jus Presses"], name: "Jus Fraise-Banane", description: "Jus fraise et banane.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Jus Presses"), subcategoryId: sub["Jus Presses"], name: "Jus d'Orange", description: "Jus d'orange pressee.", price: "250", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Jus Presses"), subcategoryId: sub["Jus Presses"], name: "Jus de Fraise", description: "Jus de fraise frais.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Jus Presses"), subcategoryId: sub["Jus Presses"], name: "Jus de Citron", description: "Jus de citron frais.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 6 },

    // Smoothies
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Mangue Petit", description: "Smoothie mangue.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Mangue Grand", description: "Smoothie mangue.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Framboise Petit", description: "Smoothie framboise.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Framboise Grand", description: "Smoothie framboise.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Mangue Passion Petit", description: "Smoothie mangue et fruit de la passion.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Mangue Passion Grand", description: "Smoothie mangue et fruit de la passion.", price: "650", imageUrl: img(2), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Citron Framboise Petit", description: "Smoothie citron et framboise.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Citron Framboise Grand", description: "Smoothie citron et framboise.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 8 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Bora Bora Petit", description: "Smoothie aux fruits exotiques.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 9 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Bora Bora Grand", description: "Smoothie aux fruits exotiques.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 10 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Pina Colada Petit", description: "Smoothie coco et ananas.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 11 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Pina Colada Grand", description: "Smoothie coco et ananas.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 12 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Framboise Banane Petit", description: "Smoothie framboise et banane.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 13 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Framboise Banane Grand", description: "Smoothie framboise et banane.", price: "650", imageUrl: img(2), isAvailable: true, sortOrder: 14 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Fruit des Bois Petit", description: "Smoothie fruits des bois.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 15 },
    { categoryId: cId("Smoothies"), subcategoryId: sub["Smoothies"], name: "Fruit des Bois Grand", description: "Smoothie fruits des bois.", price: "650", imageUrl: img(2), isAvailable: true, sortOrder: 16 },

    // Mojitos & Diabolo
    { categoryId: cId("Mojitos & Diabolo"), subcategoryId: sub["Mojitos & Diabolo"], name: "Mojito Classic", description: "Mojito sans alcool classique.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Mojitos & Diabolo"), subcategoryId: sub["Mojitos & Diabolo"], name: "Mojito Fraise", description: "Mojito a la fraise.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Mojitos & Diabolo"), subcategoryId: sub["Mojitos & Diabolo"], name: "Diabolo Menthe", description: "Sirop de menthe et limonade.", price: "150", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Mojitos & Diabolo"), subcategoryId: sub["Mojitos & Diabolo"], name: "Diabolo Fraise", description: "Sirop de fraise et limonade.", price: "150", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Mojitos & Diabolo"), subcategoryId: sub["Mojitos & Diabolo"], name: "Diabolo Pomme", description: "Sirop de pomme et limonade.", price: "150", imageUrl: img(2), isAvailable: true, sortOrder: 5 },

    // Boissons Chaudes
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "Latte", description: "Cafe latte chaud.", price: "250", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "Latte Noisette", description: "Latte aromatise noisette.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "Cafe Caramel Macchiato", description: "Cafe caramel macchiato.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "Cafe Mocha", description: "Cafe mocha au chocolat.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "Chocolat Chaud", description: "Chocolat chaud.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "Cappuccino", description: "Cappuccino classique.", price: "200", imageUrl: img(2), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "Cafe Capsule", description: "Cafe prepare avec capsule.", price: "150", imageUrl: img(2), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "Nesquik", description: "Boisson chaude Nesquik.", price: "150", imageUrl: img(2), isAvailable: true, sortOrder: 8 },
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "The", description: "The chaud.", price: "100", imageUrl: img(2), isAvailable: true, sortOrder: 9 },
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "Cafe Noir", description: "Cafe noir.", price: "100", imageUrl: img(2), isAvailable: true, sortOrder: 10 },
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "Americano", description: "Cafe Americano.", price: "200", imageUrl: img(2), isAvailable: true, sortOrder: 11 },
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "Cafe Bombon", description: "Cafe Bombon au lait concentre.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 12 },
    { categoryId: cId("Chaudes"), subcategoryId: sub["Chaudes"], name: "Matcha Chaud", description: "Boisson chaude au matcha.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 13 },

    // Iced Coffee
    { categoryId: cId("Iced Coffee"), subcategoryId: sub["Iced Coffee"], name: "Latte Noisette Glace", description: "Latte glace saveur noisette.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cId("Iced Coffee"), subcategoryId: sub["Iced Coffee"], name: "Caramel Macchiato Glace", description: "Caramel macchiato glace.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cId("Iced Coffee"), subcategoryId: sub["Iced Coffee"], name: "Mocha Glace", description: "Cafe mocha glace.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cId("Iced Coffee"), subcategoryId: sub["Iced Coffee"], name: "Latte Glace", description: "Latte glace.", price: "250", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cId("Iced Coffee"), subcategoryId: sub["Iced Coffee"], name: "Affogato", description: "Espresso servi avec glace.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cId("Iced Coffee"), subcategoryId: sub["Iced Coffee"], name: "Matcha Glace", description: "Matcha glace.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 6 },
    { categoryId: cId("Iced Coffee"), subcategoryId: sub["Iced Coffee"], name: "Americano Glace", description: "Americano glace.", price: "250", imageUrl: img(2), isAvailable: true, sortOrder: 7 },
    { categoryId: cId("Iced Coffee"), subcategoryId: sub["Iced Coffee"], name: "Iced Spanish Latte", description: "Spanish latte glace.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 8 },
  ]);

  console.log("Seed complete: 7 categories, subcategories, ~190 dishes inserted.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
