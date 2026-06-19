import { db, categoriesTable, dishesTable } from "@workspace/db";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isConnReset(err) {
  return err?.cause?.code === "ECONNRESET" || err?.code === "ECONNRESET";
}

async function withRetry(fn, label) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(
        `[${label}] tentative ${attempt}/${MAX_RETRIES} echouee${isConnReset(err) ? " (ECONNRESET - connexion Neon coupee, probablement un cold start)" : ""}: ${err.message}`
      );
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * attempt;
        console.log(`  -> nouvelle tentative dans ${delay / 1000}s...`);
        await sleep(delay);
      }
    }
  }
  throw lastError;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function seed() {
  console.log("Seeding database...");

  await withRetry(() => db.delete(dishesTable), "delete dishes");
  await withRetry(() => db.delete(categoriesTable), "delete categories");

  const categoriesData = [
    { name: "Crepes Sucrees", icon: "🥞", sortOrder: 1 },
    { name: "Crepes Salees", icon: "🥞", sortOrder: 2 },
    { name: "Gaufres", icon: "🧇", sortOrder: 3 },
    { name: "Ploffines Sucrees", icon: "🍯", sortOrder: 4 },
    { name: "Ploffines Salees", icon: "🧀", sortOrder: 5 },
    { name: "Pancakes", icon: "🥞", sortOrder: 6 },
    { name: "Cheesecakes", icon: "🍰", sortOrder: 7 },
    { name: "Cookies", icon: "🍪", sortOrder: 8 },
    { name: "Crepes Premium", icon: "✨", sortOrder: 9 },
    { name: "Fondant", icon: "🍫", sortOrder: 10 },
    { name: "Chtouta", icon: "🍮", sortOrder: 11 },
    { name: "Brownie Gourmand", icon: "🍫", sortOrder: 12 },
    { name: "Brownie Bowl", icon: "🍫", sortOrder: 13 },
    { name: "Sundae", icon: "🍨", sortOrder: 14 },
    { name: "Sundae Croquants", icon: "🍬", sortOrder: 15 },
    { name: "Sundae Toppings 100", icon: "🍓", sortOrder: 16 },
    { name: "Sundae Toppings 200", icon: "🍫", sortOrder: 17 },
    { name: "Sundae Toppings 150", icon: "🍬", sortOrder: 18 },
    { name: "Sundae Signatures", icon: "🍨", sortOrder: 19 },
    { name: "Frappes", icon: "🥤", sortOrder: 20 },
    { name: "Frappes Signature", icon: "🥤", sortOrder: 21 },
    { name: "Frappuccino", icon: "☕", sortOrder: 22 },
    { name: "Jus Presses", icon: "🍊", sortOrder: 23 },
    { name: "Smoothies", icon: "🍓", sortOrder: 24 },
    { name: "Mojitos", icon: "🍹", sortOrder: 25 },
    { name: "Diabolo", icon: "🍋", sortOrder: 26 },
    { name: "Boissons Chaudes", icon: "☕", sortOrder: 27 },
    { name: "Iced Coffee", icon: "🧊", sortOrder: 28 },
  ];

  const categories = await withRetry(
    () => db.insert(categoriesTable).values(categoriesData).returning(),
    "insert categories"
  );

  const cat = Object.fromEntries(categories.map((c) => [c.name, c.id]));
  console.log("Categories inserted:", categories.map((c) => c.name));

  const placeholders = [
    "/placeholder-pizza.png",
    "/placeholder-sandwich.png",
    "/placeholder-boisson.png",
    "/placeholder-dessert.png",
  ];
  const img = (i) => placeholders[i % placeholders.length];

  const dishesData = [
    // Crepes Sucrees
    { categoryId: cat["Crepes Sucrees"], name: "Crepe Nutella", description: "Crepe artisanale au Nutella.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe Chocolat", description: "Crepe artisanale au chocolat.", price: "300", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe Nutella Banane", description: "Crepe artisanale au Nutella et banane.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe Nutella Bueno", description: "Crepe artisanale au Nutella et Kinder Bueno.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe Chocolat Banane", description: "Crepe artisanale au chocolat et banane.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe Caramel Beurre Sale", description: "Crepe artisanale au caramel beurre sale.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe Chocolat Oreo", description: "Crepe artisanale au chocolat et Oreo.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe 3 Chocolats", description: "Crepe artisanale aux trois chocolats.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe aux Fruits", description: "2 fruits avec sirop d'erable.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 9 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe Bueno", description: "Sauce Bueno + Kinder Bueno.", price: "700", imageUrl: img(3), isAvailable: true, sortOrder: 10 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe Pistache", description: "Sauce pistache + croquant pistache.", price: "750", imageUrl: img(3), isAvailable: true, sortOrder: 11 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe Gourmande", description: "Sauce Kinder chocolat + glace.", price: "800", imageUrl: img(3), isAvailable: true, sortOrder: 12 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe Plöofy", description: "Melange de fruits + 3 chocolats + chantilly.", price: "1000", imageUrl: img(3), isAvailable: true, sortOrder: 13 },
    { categoryId: cat["Crepes Sucrees"], name: "Crepe Nature ou Sucre", description: "Crepe nature ou avec sucre.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 14 },

    // Crepes Salees
    { categoryId: cat["Crepes Salees"], name: "Crepe Fromage", description: "Crepe garnie de fromage.", price: "300", imageUrl: img(0), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Crepes Salees"], name: "Crepe Thon", description: "Crepe garnie de thon.", price: "350", imageUrl: img(0), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Crepes Salees"], name: "Crepe Poulet", description: "Crepe garnie de poulet.", price: "450", imageUrl: img(0), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Crepes Salees"], name: "Crepe Poulet Pane", description: "Crepe garnie de poulet pane.", price: "500", imageUrl: img(0), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Crepes Salees"], name: "Crepe 4 Fromages", description: "Melange de quatre fromages.", price: "400", imageUrl: img(0), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Crepes Salees"], name: "Crepe Mixte", description: "Garniture mixte.", price: "550", imageUrl: img(0), isAvailable: true, sortOrder: 6 },

    // Gaufres
    { categoryId: cat["Gaufres"], name: "Gaufre Nutella", description: "Gaufre au Nutella.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Gaufres"], name: "Gaufre Chocolat", description: "Gaufre au chocolat.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Gaufres"], name: "Gaufre Nutella Banane", description: "Gaufre au Nutella et banane.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Gaufres"], name: "Gaufre Nutella Bueno", description: "Gaufre au Nutella et Kinder Bueno.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Gaufres"], name: "Gaufre Chocolat Banane", description: "Gaufre au chocolat et banane.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Gaufres"], name: "Gaufre Caramel Beurre Sale", description: "Gaufre au caramel beurre sale.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Gaufres"], name: "Gaufre Chocolat + Speculoos", description: "Gaufre au chocolat et Speculoos.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Gaufres"], name: "Gaufre Chocolat + Chantilly", description: "Gaufre au chocolat avec chantilly.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Gaufres"], name: "Gaufre O'Fruits", description: "2 fruits + Nutella.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 9 },
    { categoryId: cat["Gaufres"], name: "Gaufre Pistache", description: "Sauce pistache + croquant pistache.", price: "800", imageUrl: img(3), isAvailable: true, sortOrder: 10 },
    { categoryId: cat["Gaufres"], name: "Gaufre Gourmande", description: "Caramel beurre sale + glace + fruit.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 11 },
    { categoryId: cat["Gaufres"], name: "Gaufre Plöofy", description: "Melange de fruits + 3 chocolats + glace.", price: "1000", imageUrl: img(3), isAvailable: true, sortOrder: 12 },
    { categoryId: cat["Gaufres"], name: "Gaufre Nature ou Sucre", description: "Gaufre nature ou avec sucre.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 13 },

    // Ploffines Sucrees
    { categoryId: cat["Ploffines Sucrees"], name: "Ploffine Chocolat", description: "Ploffine au chocolat.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Ploffines Sucrees"], name: "Ploffine Nutella", description: "Ploffine au Nutella.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Ploffines Sucrees"], name: "Ploffine Caramel Beurre Sale", description: "Ploffine au caramel beurre sale.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Ploffines Sucrees"], name: "Ploffine Chocolat Oreo", description: "Ploffine chocolat Oreo.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Ploffines Sucrees"], name: "Ploffine Nutella Banane", description: "Ploffine Nutella banane.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Ploffines Sucrees"], name: "Ploffine Lotus", description: "Ploffine Lotus.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Ploffines Sucrees"], name: "Ploffine 3 Chocolats", description: "Ploffine aux trois chocolats.", price: "700", imageUrl: img(3), isAvailable: true, sortOrder: 7 },

    // Ploffines Salees
    { categoryId: cat["Ploffines Salees"], name: "Ploffine Poulet", description: "Ploffine au poulet.", price: "350", imageUrl: img(0), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Ploffines Salees"], name: "Ploffine Thon", description: "Ploffine au thon.", price: "350", imageUrl: img(0), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Ploffines Salees"], name: "Ploffine Legumes", description: "Ploffine aux legumes.", price: "300", imageUrl: img(0), isAvailable: true, sortOrder: 3 },

    // Pancakes
    { categoryId: cat["Pancakes"], name: "Pancakes Nutella", description: "Pancakes au Nutella.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Pancakes"], name: "Pancakes Chocolat", description: "Pancakes au chocolat.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Pancakes"], name: "Pancakes Nutella Banane", description: "Pancakes Nutella banane.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Pancakes"], name: "Pancakes Nutella Bueno", description: "Pancakes Nutella Kinder Bueno.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Pancakes"], name: "Pancakes Chocolat Banane", description: "Pancakes chocolat banane.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Pancakes"], name: "Pancakes Caramel Beurre Sale", description: "Pancakes caramel beurre sale.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Pancakes"], name: "Pancakes Canadien", description: "Pancakes avec sirop d'erable.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Pancakes"], name: "Pancakes Orella", description: "Chocolat + Oreo.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Pancakes"], name: "Pancakes Pistache", description: "Sauce pistache + feuilletine.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 9 },
    { categoryId: cat["Pancakes"], name: "Pancakes Gourmande", description: "Sauce Bueno + glace.", price: "700", imageUrl: img(3), isAvailable: true, sortOrder: 10 },
    { categoryId: cat["Pancakes"], name: "Pancakes Plöofy", description: "Melange de fruits + 3 chocolats + chantilly.", price: "1000", imageUrl: img(3), isAvailable: true, sortOrder: 11 },
    { categoryId: cat["Pancakes"], name: "Pancakes Nature ou Sucre", description: "Pancakes nature ou avec sucre.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 12 },

    // Cheesecakes
    { categoryId: cat["Cheesecakes"], name: "Cheesecake Kinder Bueno", description: "Cheesecake saveur Kinder Bueno.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Cheesecakes"], name: "Cheesecake Nutella", description: "Cheesecake saveur Nutella.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Cheesecakes"], name: "Cheesecake Pistache", description: "Cheesecake saveur pistache.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Cheesecakes"], name: "Cheesecake Lotus", description: "Cheesecake saveur Lotus.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Cheesecakes"], name: "Cheesecake Chocolat", description: "Cheesecake saveur chocolat.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Cheesecakes"], name: "Cheesecake Framboise", description: "Cheesecake saveur framboise.", price: "450", imageUrl: img(3), isAvailable: true, sortOrder: 6 },

    // Cookies
    { categoryId: cat["Cookies"], name: "Cookie Geant", description: "Cookie geant servi avec supplements au choix.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Cookies"], name: "Cookie Speculoos", description: "Cookie saveur Speculoos.", price: "0", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Cookies"], name: "Cookie Pistache", description: "Cookie saveur Pistache.", price: "0", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Cookies"], name: "Cookie Chocolat Noix", description: "Cookie chocolat noix.", price: "0", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Cookies"], name: "Cookie Kit Kat", description: "Cookie saveur Kit Kat.", price: "0", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Cookies"], name: "Cookie Caramel Noisette", description: "Cookie caramel noisette.", price: "0", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Cookies"], name: "Cookie 3 Chocolats", description: "Cookie aux trois chocolats.", price: "0", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Cookies"], name: "Cookie Chocolat Noir", description: "Cookie chocolat noir.", price: "0", imageUrl: img(3), isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Cookies"], name: "Cookie Oreo", description: "Cookie saveur Oreo.", price: "0", imageUrl: img(3), isAvailable: true, sortOrder: 9 },

    // Crepes Premium
    { categoryId: cat["Crepes Premium"], name: "Kinder", description: "Crepe fourree au brownie, fruits, creme fouettee, croquant Oreo, chocolat blanc.", price: "900", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Crepes Premium"], name: "Lotus", description: "Crepe fourree au brownie, fruits, creme fouettee, croquant Speculoos, chocolat blanc.", price: "1000", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Crepes Premium"], name: "Pistache", description: "Crepe fourree au brownie, fruits, creme fouettee, croquant pistache, chocolat noisette.", price: "1100", imageUrl: img(3), isAvailable: true, sortOrder: 3 },

    // Fondant
    { categoryId: cat["Fondant"], name: "Fondant Chocolat", description: "Fondant au chocolat.", price: "300", imageUrl: img(3), isAvailable: true, sortOrder: 1 },

    // Chtouta
    { categoryId: cat["Chtouta"], name: "Chocolat", description: "Chtouta au chocolat.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Chtouta"], name: "Chocolat + Moukassarat", description: "Chocolat avec fruits secs.", price: "700", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Chtouta"], name: "Bueno + Noisette", description: "Bueno avec noisette.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Chtouta"], name: "Chocolat + Fruit", description: "Chocolat avec fruits.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Chtouta"], name: "Pistache", description: "Chtouta a la pistache.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Chtouta"], name: "Caramel + Banane", description: "Caramel avec banane.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Chtouta"], name: "Chocolat + Noisette", description: "Chocolat avec noisette.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Chtouta"], name: "Caramel", description: "Chtouta au caramel.", price: "400", imageUrl: img(3), isAvailable: true, sortOrder: 8 },

    // Brownie Gourmand
    { categoryId: cat["Brownie Gourmand"], name: "Oreo", description: "Brownies fourre avec de la creme fouettee, deux chocolats (lait, blanc), Oreo.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Brownie Gourmand"], name: "Pistache", description: "Brownies fourre avec de la creme fouettee, deux chocolats (pistache, blanc), pistache.", price: "750", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Brownie Gourmand"], name: "Kinder", description: "Brownies fourre avec de la creme fouettee, deux chocolats (lait, blanc), Kinder.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Brownie Gourmand"], name: "Aux Fruits", description: "Brownies fourre avec de la creme fouettee, deux chocolats (lait, blanc), fruits.", price: "700", imageUrl: img(3), isAvailable: true, sortOrder: 4 },

    // Brownie Bowl
    { categoryId: cat["Brownie Bowl"], name: "Brownie 2 Chocolats", description: "Brownies, chocolat noisette, chocolat blanc.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Brownie Bowl"], name: "Brownie Yummy", description: "Brownies, chocolat, glace.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Brownie Bowl"], name: "Brownie Le Parfait", description: "Brownies, chantilly, banane, caramel beurre sale.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 3 },

    // Sundae
    { categoryId: cat["Sundae"], name: "Sundae S", description: "Glace sundae format Small.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Sundae"], name: "Sundae M", description: "Glace sundae format Medium.", price: "250", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Sundae"], name: "Sundae XL", description: "Glace sundae format XL.", price: "350", imageUrl: img(3), isAvailable: true, sortOrder: 3 },

    // Sundae Croquants
    { categoryId: cat["Sundae Croquants"], name: "Supplement Croquant", description: "M&M's, Kinder Bueno, Snickers, Mars, Oreo, Lotus, Lion, KitKat. (+200 DA)", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 1 },

    // Sundae Toppings 100
    { categoryId: cat["Sundae Toppings 100"], name: "Fraise", description: "Topping fraise.", price: "100", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Sundae Toppings 100"], name: "Chocolat", description: "Topping chocolat.", price: "100", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Sundae Toppings 100"], name: "Caramel", description: "Topping caramel.", price: "100", imageUrl: img(3), isAvailable: true, sortOrder: 3 },

    // Sundae Toppings 200
    { categoryId: cat["Sundae Toppings 200"], name: "Nutella", description: "Topping Nutella.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Sundae Toppings 200"], name: "Framboise", description: "Topping framboise.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Sundae Toppings 200"], name: "Mangue", description: "Topping mangue.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Sundae Toppings 200"], name: "Ferrero Rocher", description: "Topping Ferrero Rocher.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Sundae Toppings 200"], name: "Caramel Crispy", description: "Topping caramel crispy.", price: "200", imageUrl: img(3), isAvailable: true, sortOrder: 5 },

    // Sundae Toppings 150
    { categoryId: cat["Sundae Toppings 150"], name: "Raffaello", description: "Topping Raffaello.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Sundae Toppings 150"], name: "Bounty", description: "Topping Bounty.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Sundae Toppings 150"], name: "KitKat", description: "Topping KitKat.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Sundae Toppings 150"], name: "Caramel Beurre Sale", description: "Topping caramel beurre sale.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Sundae Toppings 150"], name: "Bueno White", description: "Topping Kinder Bueno White.", price: "150", imageUrl: img(3), isAvailable: true, sortOrder: 5 },

    // Sundae Signatures
    { categoryId: cat["Sundae Signatures"], name: "Caramel M&M's", description: "Sundae signature au caramel et M&M's.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Sundae Signatures"], name: "Tropical", description: "Sundae signature aux fruits tropicaux.", price: "600", imageUrl: img(3), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Sundae Signatures"], name: "Full Bueno", description: "Sundae signature Kinder Bueno.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Sundae Signatures"], name: "Caramel-Cookies", description: "Sundae signature caramel et cookies.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Sundae Signatures"], name: "Pistache", description: "Sundae signature a la pistache.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Sundae Signatures"], name: "Lotus", description: "Sundae signature Lotus.", price: "650", imageUrl: img(3), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Sundae Signatures"], name: "Chocolat-KitKat", description: "Sundae signature chocolat et KitKat.", price: "500", imageUrl: img(3), isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Sundae Signatures"], name: "Oreo-Caramel BS", description: "Sundae signature Oreo et caramel beurre sale.", price: "550", imageUrl: img(3), isAvailable: true, sortOrder: 8 },

    // Frappes
    { categoryId: cat["Frappes"], name: "Frappe Chocolat Petit", description: "Frappe au chocolat.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Frappes"], name: "Frappe Chocolat Grand", description: "Frappe au chocolat.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Frappes"], name: "Frappe Oreo Petit", description: "Frappe Oreo.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Frappes"], name: "Frappe Oreo Grand", description: "Frappe Oreo.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Frappes"], name: "Frappe Bounty Petit", description: "Frappe Bounty.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Frappes"], name: "Frappe Bounty Grand", description: "Frappe Bounty.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Frappes"], name: "Frappe Kinder Petit", description: "Frappe Kinder.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Frappes"], name: "Frappe Kinder Grand", description: "Frappe Kinder.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Frappes"], name: "Frappe Speculoos Petit", description: "Frappe Speculoos.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 9 },
    { categoryId: cat["Frappes"], name: "Frappe Speculoos Grand", description: "Frappe Speculoos.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 10 },
    { categoryId: cat["Frappes"], name: "Frappe Rafaello Petit", description: "Frappe Rafaello.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 11 },
    { categoryId: cat["Frappes"], name: "Frappe Rafaello Grand", description: "Frappe Rafaello.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 12 },
    { categoryId: cat["Frappes"], name: "Frappe Banane Petit", description: "Frappe banane.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 13 },
    { categoryId: cat["Frappes"], name: "Frappe Banane Grand", description: "Frappe banane.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 14 },
    { categoryId: cat["Frappes"], name: "Frappe Oreo-Banane Petit", description: "Frappe Oreo et banane.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 15 },
    { categoryId: cat["Frappes"], name: "Frappe Oreo-Banane Grand", description: "Frappe Oreo et banane.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 16 },
    { categoryId: cat["Frappes"], name: "Frappe Nutella Petit", description: "Frappe Nutella.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 17 },
    { categoryId: cat["Frappes"], name: "Frappe Nutella Grand", description: "Frappe Nutella.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 18 },
    { categoryId: cat["Frappes"], name: "Frappe Snickers Petit", description: "Frappe Snickers.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 19 },
    { categoryId: cat["Frappes"], name: "Frappe Snickers Grand", description: "Frappe Snickers.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 20 },
    { categoryId: cat["Frappes"], name: "Frappe Fraise-Banane Petit", description: "Frappe fraise et banane.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 21 },
    { categoryId: cat["Frappes"], name: "Frappe Fraise-Banane Grand", description: "Frappe fraise et banane.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 22 },
    { categoryId: cat["Frappes"], name: "Frappe Citron Petit", description: "Frappe citron.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 23 },
    { categoryId: cat["Frappes"], name: "Frappe Citron Grand", description: "Frappe citron.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 24 },
    { categoryId: cat["Frappes"], name: "Frappe Chocolat-Banane Petit", description: "Frappe chocolat et banane.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 25 },
    { categoryId: cat["Frappes"], name: "Frappe Chocolat-Banane Grand", description: "Frappe chocolat et banane.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 26 },
    { categoryId: cat["Frappes"], name: "Frappe KitKat Petit", description: "Frappe KitKat.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 27 },
    { categoryId: cat["Frappes"], name: "Frappe KitKat Grand", description: "Frappe KitKat.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 28 },
    { categoryId: cat["Frappes"], name: "Frappe Caramel BS Petit", description: "Frappe caramel beurre sale.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 29 },
    { categoryId: cat["Frappes"], name: "Frappe Caramel BS Grand", description: "Frappe caramel beurre sale.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 30 },
    { categoryId: cat["Frappes"], name: "Frappe Mangue Petit", description: "Frappe mangue.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 31 },
    { categoryId: cat["Frappes"], name: "Frappe Mangue Grand", description: "Frappe mangue.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 32 },
    { categoryId: cat["Frappes"], name: "Frappe Framboise Petit", description: "Frappe framboise.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 33 },
    { categoryId: cat["Frappes"], name: "Frappe Framboise Grand", description: "Frappe framboise.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 34 },

    // Frappes Signature
    { categoryId: cat["Frappes Signature"], name: "Pistach Petit", description: "Frappe signature a la pistache.", price: "650", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Frappes Signature"], name: "Pistach Grand", description: "Frappe signature a la pistache.", price: "800", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Frappes Signature"], name: "Fruits des Bois Petit", description: "Frappe signature fruits des bois.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Frappes Signature"], name: "Fruits des Bois Grand", description: "Frappe signature fruits des bois.", price: "700", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Frappes Signature"], name: "Ferrero Rocher Petit", description: "Frappe signature Ferrero Rocher.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Frappes Signature"], name: "Ferrero Rocher Grand", description: "Frappe signature Ferrero Rocher.", price: "750", imageUrl: img(2), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Frappes Signature"], name: "Caramel Crispy Petit", description: "Frappe signature caramel crispy.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Frappes Signature"], name: "Caramel Crispy Grand", description: "Frappe signature caramel crispy.", price: "750", imageUrl: img(2), isAvailable: true, sortOrder: 8 },

    // Frappuccino
    { categoryId: cat["Frappuccino"], name: "Vanille", description: "Frappuccino vanille.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Frappuccino"], name: "Choco-Chip", description: "Frappuccino aux pepites de chocolat.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Frappuccino"], name: "Caramel", description: "Frappuccino caramel.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Frappuccino"], name: "Cafe", description: "Frappuccino cafe.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Frappuccino"], name: "Fraise", description: "Frappuccino fraise.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Frappuccino"], name: "Cookies", description: "Frappuccino cookies.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Frappuccino"], name: "Noisette", description: "Frappuccino noisette.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Frappuccino"], name: "Brownies", description: "Frappuccino brownies.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 8 },

    // Jus Presses
    { categoryId: cat["Jus Presses"], name: "Jus Cocktail", description: "Melange de fruits frais.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Jus Presses"], name: "Jus Banane", description: "Jus de banane frais.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Jus Presses"], name: "Jus Fraise-Banane", description: "Jus fraise et banane.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Jus Presses"], name: "Jus d'Orange", description: "Jus d'orange pressee.", price: "250", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Jus Presses"], name: "Jus de Fraise", description: "Jus de fraise frais.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Jus Presses"], name: "Jus de Citron", description: "Jus de citron frais.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 6 },

    // Smoothies
    { categoryId: cat["Smoothies"], name: "Mangue Petit", description: "Smoothie mangue.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Smoothies"], name: "Mangue Grand", description: "Smoothie mangue.", price: "550", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Smoothies"], name: "Framboise Petit", description: "Smoothie framboise.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Smoothies"], name: "Framboise Grand", description: "Smoothie framboise.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Smoothies"], name: "Mangue Passion Petit", description: "Smoothie mangue et fruit de la passion.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Smoothies"], name: "Mangue Passion Grand", description: "Smoothie mangue et fruit de la passion.", price: "650", imageUrl: img(2), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Smoothies"], name: "Citron Framboise Petit", description: "Smoothie citron et framboise.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Smoothies"], name: "Citron Framboise Grand", description: "Smoothie citron et framboise.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Smoothies"], name: "Bora Bora Petit", description: "Smoothie aux fruits exotiques.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 9 },
    { categoryId: cat["Smoothies"], name: "Bora Bora Grand", description: "Smoothie aux fruits exotiques.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 10 },
    { categoryId: cat["Smoothies"], name: "Pina Colada Petit", description: "Smoothie coco et ananas.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 11 },
    { categoryId: cat["Smoothies"], name: "Pina Colada Grand", description: "Smoothie coco et ananas.", price: "600", imageUrl: img(2), isAvailable: true, sortOrder: 12 },
    { categoryId: cat["Smoothies"], name: "Framboise Banane Petit", description: "Smoothie framboise et banane.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 13 },
    { categoryId: cat["Smoothies"], name: "Framboise Banane Grand", description: "Smoothie framboise et banane.", price: "650", imageUrl: img(2), isAvailable: true, sortOrder: 14 },
    { categoryId: cat["Smoothies"], name: "Fruit des Bois Petit", description: "Smoothie fruits des bois.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 15 },
    { categoryId: cat["Smoothies"], name: "Fruit des Bois Grand", description: "Smoothie fruits des bois.", price: "650", imageUrl: img(2), isAvailable: true, sortOrder: 16 },

    // Mojitos
    { categoryId: cat["Mojitos"], name: "Classic", description: "Mojito sans alcool classique.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Mojitos"], name: "Fraise", description: "Mojito a la fraise.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 2 },

    // Diabolo
    { categoryId: cat["Diabolo"], name: "Diabolo Menthe", description: "Sirop de menthe et limonade.", price: "150", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Diabolo"], name: "Diabolo Fraise", description: "Sirop de fraise et limonade.", price: "150", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Diabolo"], name: "Diabolo Pomme", description: "Sirop de pomme et limonade.", price: "150", imageUrl: img(2), isAvailable: true, sortOrder: 3 },

    // Boissons Chaudes
    { categoryId: cat["Boissons Chaudes"], name: "Latte", description: "Cafe latte chaud.", price: "250", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Boissons Chaudes"], name: "Latte Noisette", description: "Latte aromatise noisette.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Boissons Chaudes"], name: "Cafe Caramel Macchiato", description: "Cafe caramel macchiato.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Boissons Chaudes"], name: "Cafe Mocha", description: "Cafe mocha au chocolat.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Boissons Chaudes"], name: "Chocolat Chaud", description: "Chocolat chaud.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Boissons Chaudes"], name: "Cappuccino", description: "Cappuccino classique.", price: "200", imageUrl: img(2), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Boissons Chaudes"], name: "Cafe Capsule", description: "Cafe prepare avec capsule.", price: "150", imageUrl: img(2), isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Boissons Chaudes"], name: "Nesquik", description: "Boisson chaude Nesquik.", price: "150", imageUrl: img(2), isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Boissons Chaudes"], name: "The", description: "The chaud.", price: "100", imageUrl: img(2), isAvailable: true, sortOrder: 9 },
    { categoryId: cat["Boissons Chaudes"], name: "Cafe Noir", description: "Cafe noir.", price: "100", imageUrl: img(2), isAvailable: true, sortOrder: 10 },
    { categoryId: cat["Boissons Chaudes"], name: "Americano", description: "Cafe Americano.", price: "200", imageUrl: img(2), isAvailable: true, sortOrder: 11 },
    { categoryId: cat["Boissons Chaudes"], name: "Cafe Bombon", description: "Cafe Bombon au lait concentre.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 12 },
    { categoryId: cat["Boissons Chaudes"], name: "Matcha", description: "Boisson chaude au matcha.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 13 },

    // Iced Coffee
    { categoryId: cat["Iced Coffee"], name: "Latte Noisette", description: "Latte glace saveur noisette.", price: "350", imageUrl: img(2), isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Iced Coffee"], name: "Cafe Caramel Macchiato", description: "Caramel macchiato glace.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Iced Coffee"], name: "Cafe Mocha", description: "Cafe mocha glace.", price: "300", imageUrl: img(2), isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Iced Coffee"], name: "Latte", description: "Latte glace.", price: "250", imageUrl: img(2), isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Iced Coffee"], name: "Affogato", description: "Espresso servi avec glace.", price: "400", imageUrl: img(2), isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Iced Coffee"], name: "Matcha", description: "Matcha glace.", price: "500", imageUrl: img(2), isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Iced Coffee"], name: "Americano", description: "Americano glace.", price: "250", imageUrl: img(2), isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Iced Coffee"], name: "Iced Spanish Latte", description: "Spanish latte glace.", price: "450", imageUrl: img(2), isAvailable: true, sortOrder: 8 },
  ];

  const batches = chunk(dishesData, 40);
  for (let i = 0; i < batches.length; i++) {
    await withRetry(
      () => db.insert(dishesTable).values(batches[i]),
      `insert dishes batch ${i + 1}/${batches.length}`
    );
    console.log(`  Batch ${i + 1}/${batches.length} insere (${batches[i].length} plats)`);
  }

  console.log(`Seed complete! ${categories.length} categories, ${dishesData.length} dishes inserted.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed apres tous les retries:", err);
  process.exit(1);
});
