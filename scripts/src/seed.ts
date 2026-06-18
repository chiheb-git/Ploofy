import { db, categoriesTable, dishesTable } from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  await db.delete(dishesTable);
  await db.delete(categoriesTable);

  const categories = await db
    .insert(categoriesTable)
    .values([
      { name: "Plats", icon: "🍽️", sortOrder: 1 },
      { name: "Tadjines", icon: "🫕", sortOrder: 2 },
      { name: "Kesra", icon: "🫓", sortOrder: 3 },
      { name: "Poissons", icon: "🐟", sortOrder: 4 },
      { name: "Pizzas", icon: "🍕", sortOrder: 5 },
      { name: "Pâtes", icon: "🍝", sortOrder: 6 },
      { name: "Suppléments", icon: "➕", sortOrder: 7 },
      { name: "Hamburgers", icon: "🍔", sortOrder: 8 },
      { name: "Sur commande", icon: "📋", sortOrder: 9 },
      { name: "Desserts", icon: "🍰", sortOrder: 10 },
      { name: "Boissons chaudes", icon: "☕", sortOrder: 11 },
      { name: "Mocktails", icon: "🍹", sortOrder: 12 },
      { name: "Boissons fraîches", icon: "🥤", sortOrder: 13 },
    ])
    .returning();

  const cat = Object.fromEntries(categories.map(c => [c.name, c.id]));
  console.log("Categories inserted:", categories.map(c => c.name));

  const placeholders = [
    "/placeholder-pizza.png",
    "/placeholder-sandwich.png",
    "/placeholder-boisson.png",
    "/placeholder-dessert.png",
  ];
  const img = (i) => placeholders[i % placeholders.length];

  await db.insert(dishesTable).values([
    // Plats
    { categoryId: cat["Plats"], name: "Cuisse farcie à la viande hachée", description: "Cuisse de poulet farcie à la viande hachée.", price: "1200", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Plats"], name: "Julienne de poulet", description: "Émincé de poulet façon julienne.", price: "1200", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Plats"], name: "Escalope méchoui", description: "Escalope grillée façon méchoui.", price: "1500", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Plats"], name: "Escalope farcie aux 4 fromages", description: "Escalope farcie avec mélange de 4 fromages.", price: "1500", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Plats"], name: "Escalope farcie à la dinde fumée", description: "Escalope garnie de dinde fumée.", price: "1500", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Plats"], name: "Escalope farcie aux noix (sucré/salé)", description: "Escalope farcie aux noix, saveur sucrée-salée.", price: "1500", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Plats"], name: "Steak à cheval", description: "Steak accompagné d'un œuf.", price: "1500", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Plats"], name: "Mélange de viande", description: "Assortiment de viandes.", price: "2000", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Plats"], name: "Côtelette de veau", description: "Côtelette de veau grillée.", price: "2100", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 9 },
    { categoryId: cat["Plats"], name: "Entrecôte", description: "Entrecôte de bœuf.", price: "2200", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 10 },
    { categoryId: cat["Plats"], name: "Foie en sauce", description: "Foie préparé en sauce. Selon disponibilité.", price: "2300", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 11 },
    { categoryId: cat["Plats"], name: "Foie grillé", description: "Foie grillé. Selon disponibilité.", price: "2500", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 12 },
    { categoryId: cat["Plats"], name: "Filet de veau", description: "Filet de veau. Selon disponibilité.", price: "2500", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 13 },
    { categoryId: cat["Plats"], name: "Carré d'agneau", description: "Carré d'agneau. Selon disponibilité.", price: "2500", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 14 },
    { categoryId: cat["Plats"], name: "Rôti d'agneau farci aux champignons et à la viande hachée", description: "Rôti d'agneau farci.", price: "2500", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 15 },

    // Tadjines
    { categoryId: cat["Tadjines"], name: "Cuisse de poulet aux olives", description: "Tajine de cuisse de poulet aux olives.", price: "1200", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Tadjines"], name: "Cuisse de poulet aux petits pois et aux œufs", description: "Tajine de poulet, petits pois et œufs.", price: "1500", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Tadjines"], name: "Mhammer", description: "Tajine traditionnel Mhammer.", price: "2500", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Tadjines"], name: "Braniya et gigot d'agneau", description: "Braniya accompagnée de gigot d'agneau.", price: "2500", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Tadjines"], name: "Djelbane et gigot d'agneau", description: "Petits pois et gigot d'agneau.", price: "2500", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Tadjines"], name: "Merguez aux œufs", description: "Merguez servies avec œufs.", price: "2200", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Tadjines"], name: "Kefta (Mtewem)", description: "Boulettes de viande sauce ail.", price: "2200", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 7 },

    // Kesra
    { categoryId: cat["Kesra"], name: "Kesra Poulet", description: "Kesra garnie au poulet.", price: "500", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Kesra"], name: "Kesra Viande", description: "Kesra garnie à la viande.", price: "700", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Kesra"], name: "Kesra Melfouf", description: "Kesra au melfouf. Selon disponibilité.", price: "900", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Kesra"], name: "Kesra Crevettes", description: "Kesra aux crevettes. Selon disponibilité.", price: "900", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },

    // Poissons
    { categoryId: cat["Poissons"], name: "Dorade", description: "Dorade grillée.", price: "2000", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Poissons"], name: "Crevettes frites / en sauce", description: "Crevettes frites ou sauce.", price: "2000", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Poissons"], name: "Calamar farci", description: "Calamar farci.", price: "2200", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Poissons"], name: "Espadon", description: "Poisson espadon.", price: "2400", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Poissons"], name: "Crevette royale / Impériale", description: "Grandes crevettes.", price: "2500", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Poissons"], name: "Mélange de poissons", description: "Assortiment de poissons.", price: "3500", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 6 },

    // Pizzas
    { categoryId: cat["Pizzas"], name: "Margherita", description: "Sauce rouge, Gruyère, Mozzarella, Basilic.", price: "600", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Pizzas"], name: "Végétarienne", description: "Sauce rouge, Légumes, Cornichons, Maïs, Mozzarella, Gruyère.", price: "700", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Pizzas"], name: "Thon", description: "Sauce rouge, Thon, Gruyère, Mozzarella, Basilic.", price: "700", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Pizzas"], name: "Poulet", description: "Sauce blanche, Poulet, Gruyère, Mozzarella, Basilic.", price: "750", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Pizzas"], name: "4 Fromages", description: "Sauce blanche, Gruyère, Mozzarella, Cheddar, Camembert, Basilic.", price: "850", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Pizzas"], name: "Forestière", description: "Sauce blanche, Poulet, Champignons frais, Gruyère, Mozzarella, Basilic.", price: "850", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Pizzas"], name: "Viandella", description: "Sauce rouge, Viande hachée, Gruyère, Mozzarella, Basilic.", price: "850", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Pizzas"], name: "Orientale", description: "Sauce rouge, Merguez, Œuf, Gruyère, Mozzarella, Basilic.", price: "850", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Pizzas"], name: "Bastela", description: "Sauce blanche, Poulet, Amandes, Dioul, Cannelle, Mozzarella, Gruyère.", price: "1000", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 9 },
    { categoryId: cat["Pizzas"], name: "Fruits de mer", description: "Sauce rouge, Fruits de mer frais, Mozzarella, Gruyère. Selon disponibilité.", price: "1200", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 10 },

    // Pâtes
    { categoryId: cat["Pâtes"], name: "Carbonara", description: "Sauce fromagère, Jambon de dinde, Fromages.", price: "700", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Pâtes"], name: "Alfredo", description: "Sauce fromagère, Blanc de poulet, Champignons frais, Fromages.", price: "800", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Pâtes"], name: "Bolognaise", description: "Sauce tomate, Boulettes de bœuf, Fromages.", price: "900", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Pâtes"], name: "Crevette", description: "Crevettes sautées à l'ail, Herbes, Citron.", price: "1000", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },

    // Suppléments
    { categoryId: cat["Suppléments"], name: "Œuf", description: "Supplément.", price: "100", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Suppléments"], name: "Thon", description: "Supplément.", price: "150", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Suppléments"], name: "Dinde fumée", description: "Supplément.", price: "200", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Suppléments"], name: "Poulet", description: "Supplément.", price: "200", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Suppléments"], name: "Camembert", description: "Supplément.", price: "200", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Suppléments"], name: "Champignons frais", description: "Supplément.", price: "200", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Suppléments"], name: "Bordure fromage", description: "Croûte fromage.", price: "250", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Suppléments"], name: "Viande hachée", description: "Supplément.", price: "250", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Suppléments"], name: "Parmesan", description: "Supplément.", price: "300", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 9 },
    { categoryId: cat["Suppléments"], name: "Sauce blanche", description: "Supplément.", price: "100", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 10 },

    // Hamburgers
    { categoryId: cat["Hamburgers"], name: "Viande", description: "Viande, Salade, Tomate, Cheddar, Oignon.", price: "500", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Hamburgers"], name: "Méchoui", description: "Poulet, Salade, Tomate, Cheddar, Oignon.", price: "500", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Hamburgers"], name: "Américain", description: "Viande, Salade, Tomate, Cheddar, Œuf, Oignon.", price: "600", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Hamburgers"], name: "Jungle", description: "Viande hachée, Salade, Tomate, Cheddar, Champignons.", price: "600", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Hamburgers"], name: "Mexicain", description: "Poulet, Salade, Tomate, Cheddar, Poivron, Oignon.", price: "600", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Hamburgers"], name: "Miel", description: "Viande, Salade, Tomate, Cheddar, Camembert, Miel.", price: "800", imageUrl: img(1), modelGlbUrl: null, isAvailable: true, sortOrder: 6 },

    // Sur commande
    { categoryId: cat["Sur commande"], name: "Seffa", description: "Seffa traditionnelle sur commande.", price: "900", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Sur commande"], name: "Rechta / Couscous Poulet", description: "Rechta ou couscous accompagné de poulet.", price: "1200", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Sur commande"], name: "Rechta / Couscous Viande", description: "Rechta ou couscous accompagné de viande.", price: "2200", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Sur commande"], name: "Gachouch Signature", description: "Spécialité de la maison, prix selon le nombre de personnes.", price: "0", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Sur commande"], name: "Paella", description: "Paella individuelle.", price: "2500", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Sur commande"], name: "Paella Géante", description: "Grande paella pour groupes.", price: "10000", imageUrl: img(0), modelGlbUrl: null, isAvailable: true, sortOrder: 6 },

    // Desserts
    { categoryId: cat["Desserts"], name: "Viennoiserie", description: "Viennoiserie du jour.", price: "60", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Desserts"], name: "Msemen", description: "Crêpe traditionnelle algérienne.", price: "200", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Desserts"], name: "Trid", description: "Dessert traditionnel Trid.", price: "200", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Desserts"], name: "Meloui au miel", description: "Meloui accompagné de miel.", price: "250", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Desserts"], name: "Beghrir", description: "Crêpe mille trous.", price: "250", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Desserts"], name: "Tiramisu", description: "Dessert italien au café.", price: "400", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Desserts"], name: "Mousse au chocolat", description: "Mousse au chocolat maison.", price: "400", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Desserts"], name: "Salade de fruits", description: "Fruits frais de saison.", price: "400", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Desserts"], name: "Cheesecake", description: "Cheesecake crémeux.", price: "450", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 9 },
    { categoryId: cat["Desserts"], name: "Fondant au chocolat", description: "Gâteau fondant au chocolat.", price: "450", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 10 },
    { categoryId: cat["Desserts"], name: "Rfis", description: "Dessert traditionnel Rfis.", price: "600", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 11 },
    { categoryId: cat["Desserts"], name: "Pâtisserie au comptoir", description: "Sélection de pâtisseries disponibles. Selon disponibilité.", price: "0", imageUrl: img(3), modelGlbUrl: null, isAvailable: true, sortOrder: 12 },

    // Boissons chaudes
    { categoryId: cat["Boissons chaudes"], name: "Berad de thé", description: "Thé traditionnel servi en théière.", price: "150", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Boissons chaudes"], name: "Infusion", description: "Boisson chaude à base de plantes.", price: "150", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Boissons chaudes"], name: "Café Latte", description: "Café au lait.", price: "200", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Boissons chaudes"], name: "Café capsule", description: "Café préparé avec capsule.", price: "200", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Boissons chaudes"], name: "Chocolat au lait", description: "Boisson chocolatée au lait.", price: "200", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Boissons chaudes"], name: "Cappuccino", description: "Café cappuccino.", price: "250", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Boissons chaudes"], name: "Chocolat chaud", description: "Chocolat chaud onctueux.", price: "500", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 7 },

    // Mocktails
    { categoryId: cat["Mocktails"], name: "Virgin Mojito", description: "Mojito sans alcool.", price: "350", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Mocktails"], name: "Oasis de dattes", description: "Cocktail rafraîchissant à base de dattes.", price: "400", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Mocktails"], name: "Blue Mojito", description: "Mojito bleu sans alcool.", price: "450", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Mocktails"], name: "Citronnade orientale", description: "Citronnade à la touche orientale.", price: "450", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Mocktails"], name: "Piña Colada", description: "Piña Colada sans alcool.", price: "450", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Mocktails"], name: "Rose Royale", description: "Cocktail parfumé à la rose.", price: "500", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Mocktails"], name: "Vanilla Tropical Fresh", description: "Cocktail tropical à la vanille.", price: "500", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Mocktails"], name: "Soleil d'Orient", description: "Cocktail inspiré des saveurs orientales.", price: "500", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Mocktails"], name: "Mojito Fraise", description: "Mojito à la fraise sans alcool.", price: "500", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 9 },
    { categoryId: cat["Mocktails"], name: "Lemon Vanilla", description: "Citron et vanille.", price: "500", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 10 },
    { categoryId: cat["Mocktails"], name: "Vanilla Coffee Chill", description: "Cocktail café et vanille glacé.", price: "500", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 11 },

    // Boissons fraîches
    { categoryId: cat["Boissons fraîches"], name: "Eau PM", description: "Petite bouteille d'eau.", price: "50", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 1 },
    { categoryId: cat["Boissons fraîches"], name: "Soda 33 cl", description: "Boisson gazeuse 33 cl.", price: "100", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 2 },
    { categoryId: cat["Boissons fraîches"], name: "Canette", description: "Boisson en canette.", price: "120", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 3 },
    { categoryId: cat["Boissons fraîches"], name: "Jus 1 L", description: "Jus de fruits 1 litre.", price: "150", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 4 },
    { categoryId: cat["Boissons fraîches"], name: "Eau GM", description: "Grande bouteille d'eau.", price: "150", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 5 },
    { categoryId: cat["Boissons fraîches"], name: "Soda 1 L", description: "Boisson gazeuse 1 litre.", price: "200", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 6 },
    { categoryId: cat["Boissons fraîches"], name: "Verre de fruits pressés", description: "Jus de fruits frais pressés.", price: "400", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 7 },
    { categoryId: cat["Boissons fraîches"], name: "Milkshake au chocolat", description: "Milkshake saveur chocolat.", price: "500", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 8 },
    { categoryId: cat["Boissons fraîches"], name: "Milkshake aux fruits", description: "Milkshake aux fruits frais.", price: "500", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 9 },
    { categoryId: cat["Boissons fraîches"], name: "Carafe de fruits pressés", description: "Carafe de jus de fruits frais pressés.", price: "1200", imageUrl: img(2), modelGlbUrl: null, isAvailable: true, sortOrder: 10 },
  ]);

  console.log("Seed complete! 13 categories, 107 dishes inserted.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
