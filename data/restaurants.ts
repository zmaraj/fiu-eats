import { Restaurant } from "@/types/restaurant";

// This hardcoded array stands in for a real database table. Later, this
// list can be replaced with a database query (e.g. `SELECT * FROM
// restaurants`) without changing any of the components below — they only
// care that they receive an array of `Restaurant` objects.
export const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Panda Express",
    category: "Asian",
    rating: 4.3,
    price: "$",
    location: "FIU Graham Center",
    description: "American Chinese fast food with bowls and plates.",
  },
  {
    id: 2,
    name: "Subway",
    category: "American",
    rating: 4.1,
    price: "$",
    location: "FIU Student Center",
    description: "Sandwiches, wraps, salads, and more.",
  },
  {
    id: 3,
    name: "Starbucks",
    category: "Coffee",
    rating: 4.5,
    price: "$$",
    location: "FIU Graham Center",
    description: "Coffee, tea, pastries, and snacks.",
  },
  {
    id: 4,
    name: "Chipotle",
    category: "Mexican",
    rating: 4.4,
    price: "$$",
    location: "Near FIU",
    description: "Burritos, bowls, tacos, and salads.",
  },
  {
    id: 5,
    name: "Pollo Tropical",
    category: "American",
    rating: 4.2,
    price: "$",
    location: "FIU Graham Center",
    description: "Grilled chicken, rice, beans, and Caribbean sides.",
  },
  {
    id: 6,
    name: "Jamba Juice",
    category: "Coffee",
    rating: 4.0,
    price: "$",
    location: "FIU Student Center",
    description: "Smoothies, juices, and bowls for a quick energy boost.",
  },
];