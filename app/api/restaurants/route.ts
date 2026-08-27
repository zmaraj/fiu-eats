import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/lib/db";
import { Restaurant, NewRestaurant} from "@/types/restaurant";

// pg returns NUMERIC columns as strings (to avoid silent float rounding),
// but our Restaurant type wants `rating` as a number. Convert on the way out.
function toRestaurant(row: Restaurant & { rating: string | null }): Restaurant {
  return { ...row, rating: row.rating === null ? null : Number(row.rating) };
}

// GET /api/restaurants — used by the home page to load the full list
// from the database on page load.
export async function GET() {
  const { rows } = await pool.query(
    "SELECT id, name, category, price, location, description, rating FROM restaurants ORDER BY id"
  );
  return NextResponse.json(rows.map(toRestaurant));
}

export async function POST(request: NextRequest) {
    const body: Partial<NewRestaurant> = await request.json();
    const { name, category, price, location, description } = body;
  
    if (!name || !category || !price || !location || !description) {
      return NextResponse.json(
        { error: "name, category, price, location, and description are all required." },
        { status: 400 }
      );
    }
  
    const { rows } = await pool.query(
      `INSERT INTO restaurants (name, category, price, location, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, category, price, location, description, rating`,
      [name, category, price, location, description]
    );
  
    return NextResponse.json(toRestaurant(rows[0]), { status: 201 });
  }