import { Restaurant } from "@/types/restaurant";

// Starter data, hardcoded right here in the client bundle. Anything added
// through the "Add a restaurant" form only lives in React state on top of
// this list, so a page refresh resets everyone back to these 6.
export const initialRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "Panda Express",
    category: "Asian",
    price: "$",
    location: "FIU MANGO Building",
    description: "American Chinese fast food with bowls and plates.",
    rating: 4.3,
  },
  {
    id: 2,
    name: "Subway",
    category: "American",
    price: "$",
    location: "FIU Graham Center",
    description: "Sandwiches, wraps, salads, and more.",
    rating: 4.1,
  },
  {
    id: 3,
    name: "Starbucks",
    category: "Coffee",
    price: "$$",
    location: "FIU Green Library",
    description: "Coffee, tea, pastries, and snacks.",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Chipotle",
    category: "Mexican",
    price: "$$",
    location: "Near FIU",
    description: "Burritos, bowls, tacos, and salads.",
    rating: 4.4,
  },
  {
    id: 5,
    name: "Pollo Tropical",
    category: "American",
    price: "$",
    location: "FIU Graham Center",
    description: "Grilled chicken, rice, beans, and Caribbean sides.",
    rating: 4.2,
  },
  {
    id: 6,
    name: "Jamba Juice",
    category: "Coffee",
    price: "$",
    location: "FIU Graham Center",
    description: "Smoothies, juices, and bowls for a quick energy boost.",
    rating: 4.0,
  },
];
