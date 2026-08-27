import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const seedRestaurants = [
  { name: "Panda Express", category: "Asian", price: "$", location: "FIU MANGO Building", description: "American Chinese fast food with bowls and plates.", rating: 4.3 },
  { name: "Subway", category: "American", price: "$", location: "FIU Graham Center", description: "Sandwiches, wraps, salads, and more.", rating: 4.1 },
  { name: "Starbucks", category: "Coffee", price: "$$", location: "FIU Green Library", description: "Coffee, tea, pastries, and snacks.", rating: 4.5 },
  { name: "Chipotle", category: "Mexican", price: "$$", location: "Near FIU", description: "Burritos, bowls, tacos, and salads.", rating: 4.4 },
  { name: "Pollo Tropical", category: "American", price: "$", location: "FIU Graham Center", description: "Grilled chicken, rice, beans, and Caribbean sides.", rating: 4.2 },
  { name: "Jamba Juice", category: "Coffee", price: "$", location: "FIU Graham Center", description: "Smoothies, juices, and bowls for a quick energy boost.", rating: 4.0 },
];

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const schema = readFileSync(path.join(__dirname, "../db/schema.sql"), "utf8");
  await client.query(schema);

  const { rows } = await client.query("SELECT COUNT(*)::int AS count FROM restaurants");

  if (rows[0].count === 0) {
    for (const r of seedRestaurants) {
      await client.query(
        `INSERT INTO restaurants (name, category, price, location, description, rating)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [r.name, r.category, r.price, r.location, r.description, r.rating]
      );
    }
    console.log(`Seeded ${seedRestaurants.length} restaurants.`);
  } else {
    console.log("Restaurants table already has data, skipping seed.");
  }

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});