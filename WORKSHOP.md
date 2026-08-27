# Workshop: Adding a Database to FIU Eats

This is your teaching script for turning the starter app (restaurants
hardcoded in `data/restaurants.ts`, "Add Restaurant" only touching React
state) into the finished app (restaurants in real Postgres, shared by
everyone, surviving a refresh).

**The big idea to land with students: design the data before you touch
code.** Every part below is written so you design first, then implement,
then test that one piece before moving to the next. Nothing works
end-to-end until Part 8 — that's on purpose. Reading comes before
writing, and each part has a checkpoint so nobody is debugging five
things at once.

Rough timing for a workshop: Parts 1–4 (design + provision + seed) are
the conceptual heavy-lifting, ~40% of the time. Parts 5–9 (wiring the
code) go fast once the schema exists, because most of the frontend
(`Navbar`, `RestaurantCard`, `types/restaurant.ts`) already expects a
database-shaped `Restaurant` — you're not fighting the app, just giving
it a real backend.

---

## Part 0 — Where we're starting from (2 min recap)

Ask the room: "if two people load this site right now and one of them
adds a restaurant, does the other person see it?" No — it only lives in
that one browser's React state. Refresh the page and it's gone too.

Open `data/restaurants.ts` together. This hardcoded array is the whole
"database" right now. Today we replace it with a real one.

---

## Part 1 — Design the database (do this on a whiteboard, not in code)

Before opening an editor, design the table as a group. Open
`types/restaurant.ts` and put it on screen — a database schema is the
same idea as this TypeScript type, just describing a row instead of an
object.

```ts
export type Restaurant = {
  id: number;
  name: string;
  category: string;
  rating: number | null;
  price: string;
  location: string;
  description: string;
};
```

Walk through each field as a group and ask "what column is this, and
what rules does it need?" Guide them to these answers:

| Field | Column type | Rule | Why |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Every row needs a unique, stable identifier. `SERIAL` means Postgres assigns it automatically — nobody has to invent ids by hand. |
| `name` | `TEXT` | `NOT NULL` | A restaurant without a name doesn't make sense — the database should refuse to save one. |
| `category` | `TEXT` | `NOT NULL` | Same reasoning — required for filtering to work. |
| `price` | `TEXT` | `NOT NULL` | Stored as `"$"` / `"$$"` / `"$$$"` — a display string, not a number. |
| `location` | `TEXT` | `NOT NULL` | Required. |
| `description` | `TEXT` | `NOT NULL` | Required. |
| `rating` | `NUMERIC(2, 1)` | *(nullable — no `NOT NULL`)* | This is the interesting one. Ask: "should a brand-new restaurant someone just added already have a rating?" No — so this column has to be allowed to be empty (`NULL`) until someone rates it. |

Then introduce one column that *isn't* in the TypeScript type at all:

- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()` — the database stamps
  this automatically on insert. The app doesn't need it today, but ask:
  "if we wanted to show the newest restaurants first later, how would
  we know which ones are newest?" This is why you often add an audit
  column even before you need it.

**Checkpoint:** everyone can say, for every column, what type it is and
whether it's allowed to be empty — and *why* — before any SQL gets
written.

---

## Part 2 — Install and start Postgres locally

Everyone installs Postgres directly on their own machine (no Docker).

**macOS (Homebrew):**

```bash
brew install postgresql@16
brew services start postgresql@16
```

Homebrew's Postgres trusts your local OS user by default, so you can
create the database without a username/password:

```bash
createdb fiu_eats
```

**Windows:** install from
[postgresql.org/download/windows](https://www.postgresql.org/download/windows/).
The installer asks you to set a password for the `postgres` superuser —
remember it, you'll need it below. Then, using the "SQL Shell (psql)"
app it installs, or a terminal with `psql` on your PATH:

```bash
psql -U postgres -c "CREATE DATABASE fiu_eats;"
```

**Linux (Debian/Ubuntu):**

```bash
sudo apt install postgresql
sudo -u postgres createdb fiu_eats
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

Create `.env.example` **and** `.env.local` in the repo root (both with
the same content — `.env.local` is already gitignored, `.env.example`
is the one that gets committed so classmates know what variable to
set). The connection string depends on which path above you took:

macOS/Homebrew (no password needed):
```
DATABASE_URL=postgresql://localhost:5432/fiu_eats
```

Windows/Linux (`postgres` user with a password):
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fiu_eats
```
(swap `postgres` after the `:` for whatever password you actually set)

**Checkpoint:** confirm you can connect —

```bash
psql fiu_eats -c "\conninfo"
```

(or `psql -U postgres -d fiu_eats -c "\conninfo"` on Windows/Linux)
should print connection info with no errors.

---

## Part 3 — Write the schema

Now turn the whiteboard table from Part 1 directly into SQL. Create
`db/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  rating NUMERIC(2, 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Point out how directly this maps back to the table from Part 1 — every
column, in the same order, with the same nullability decisions.

---

## Part 4 — Seed it with starter data

We need (a) a Postgres driver for Node, and (b) a script that runs the
schema and loads the same 6 restaurants that used to live in
`data/restaurants.ts`.

Install the driver:

```bash
npm install pg
npm install -D @types/pg
```

Create `scripts/setup-db.mjs`:

```js
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
```

Add a script entry to `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "db:setup": "node --env-file=.env.local scripts/setup-db.mjs"
}
```

Run it:

```bash
npm run db:setup
```

**Checkpoint:** inspect the table directly to prove the data is really
there, independent of the Next.js app:

```bash
psql fiu_eats -c "SELECT * FROM restaurants;"
```

(Windows/Linux: `psql -U postgres -d fiu_eats -c "SELECT * FROM restaurants;"`)

You should see 6 rows.

---

## Part 5 — Connect the Next.js app to Postgres

Create `lib/db.ts`:

```ts
import { Pool } from "pg";

// Next.js reloads this module on every file change in dev, which would
// normally spin up a brand new connection pool each time and eventually
// exhaust Postgres's connection limit. Stashing the pool on `global`
// survives those reloads so we only ever create one.
declare global {
  var pgPool: Pool | undefined;
}

export const pool =
  global.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}
```

This one file is the only place in the whole app that knows how to talk
to Postgres — everything else goes through it.

---

## Part 6 — Build the read path first (GET)

We're doing GET before POST on purpose: reading is simpler than writing,
and you can verify the whole pipeline (Postgres → API → browser) works
before adding the complexity of accepting user input.

Create `app/api/restaurants/route.ts`:

```ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { Restaurant } from "@/types/restaurant";

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
```

---

## Part 7 — Point the homepage at the API

In `app/page.tsx`, remove the static import:

```ts
import { initialRestaurants } from "@/data/restaurants";
```

and replace the restaurants state with a fetch on mount:

```ts
const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/restaurants")
    .then((res) => res.json())
    .then((data) => setRestaurants(data))
    .finally(() => setLoading(false));
}, []);
```

Then restore loading guards around the two spots that currently assume
data is already there — the count text:

```tsx
{loading
  ? "Loading..."
  : `${filteredRestaurants.length} ${
      filteredRestaurants.length === 1 ? "restaurant" : "restaurants"
    } found`}
```

and the grid:

```tsx
{loading ? null : filteredRestaurants.length > 0 ? (
  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {/* ...unchanged... */}
  </div>
) : /* ...unchanged empty states... */}
```

**Checkpoint — the big "it's alive" moment:** run `npm run dev`, load
the site, and see the 6 restaurants appear. Then, with the server still
running, change a row directly in the database:

```bash
psql fiu_eats -c "UPDATE restaurants SET rating = 5.0 WHERE name = 'Starbucks';"
```

(Windows/Linux: `psql -U postgres -d fiu_eats -c "..."`)

Refresh the browser — the rating updates. This is the moment to pause
and let it land: the website has no idea that update happened until it
asks the database again. The data lives outside the app now.

(`handleCreated` and the `AddRestaurantForm` still reference the old
in-memory shape right now — that's expected, we fix it next. The app
will still build and run at this checkpoint since TypeScript doesn't
care that the Add tab is temporarily "broken" in behavior.)

---

## Part 8 — Build the write path (POST)

Now the harder direction: accepting a new restaurant from a stranger's
browser and safely getting it into the table.

Add to `app/api/restaurants/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { NewRestaurant, Restaurant } from "@/types/restaurant";

// ...toRestaurant and GET stay the same...

// POST /api/restaurants — called when someone submits the "Add a
// restaurant" form. Inserts a new row and returns it so the page can
// show it immediately without a full refetch.
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
```

Point out two things worth discussing here:

- **The `if` check** — the database will reject a missing `NOT NULL`
  column anyway, but we validate before hitting the database so we can
  return a clear error message instead of a raw SQL error.
- **`$1, $2, ...` placeholders** — never build the query by concatenating
  the user's input into the SQL string. This is what prevents SQL
  injection.
- **`RETURNING ...`** — Postgres hands back the row it just inserted
  (now with its real `id`) in the same round trip, so we don't need a
  second query to fetch what we just wrote.

---

## Part 9 — Wire the form up to the API

In `components/AddRestaurantForm.tsx`, change the prop type back to the
full restaurant the server hands back:

```ts
type AddRestaurantFormProps = {
  onCreated: (restaurant: Restaurant) => void;
};
```

(add `Restaurant` to the import from `@/types/restaurant`), then replace
`handleSubmit`:

```tsx
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  setError(null);

  try {
    const res = await fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? "Something went wrong. Please try again.");
    }

    const created: Restaurant = await res.json();
    onCreated(created);
    setForm(emptyForm);
    setJustAdded(true);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Something went wrong.");
  } finally {
    setSubmitting(false);
  }
};
```

Add the error message under the description field:

```tsx
{error && <p className="text-sm text-red-600">{error}</p>}
```

and disable the button while submitting:

```tsx
<button
  type="submit"
  disabled={submitting}
  className="w-full rounded bg-[#0B2340] py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#C89B3C] hover:text-[#0B2340] disabled:opacity-50"
>
  {submitting ? "Adding..." : "Add Restaurant"}
</button>
```

In `app/page.tsx`, `handleCreated` now just appends whatever the server
returned — no id-generation logic needed anymore, since Postgres already
assigned one:

```ts
const handleCreated = (restaurant: Restaurant) => {
  setRestaurants((current) => [...current, restaurant]);
};
```

---

## Part 10 — Prove it persists

This is the payoff. With `npm run dev` running:

1. Go to the Add Restaurant tab and submit a new restaurant.
2. It shows up in the Restaurants tab immediately.
3. **Refresh the page.** It's still there — because `GET` re-reads it
   from Postgres, not from memory.
4. Confirm it independently of the app:
   ```bash
   psql fiu_eats -c "SELECT name, location FROM restaurants ORDER BY id;"
   ```
   (Windows/Linux: `psql -U postgres -d fiu_eats -c "..."`)
5. If you have a second laptop/browser, open the site there too — same
   restaurant shows up. That's the difference between React state and a
   database in one sentence: **the data now belongs to the app, not to
   any one browser tab.**

At this point `data/restaurants.ts` is no longer imported anywhere and
can be deleted.

---

## Troubleshooting cheat sheet

- **`ECONNREFUSED` connecting to Postgres** — the server isn't running.
  macOS: `brew services list` should show `postgresql@16` as `started`
  (`brew services start postgresql@16` if not). Windows: check the
  "postgresql-x64-..." service is running in Services. Linux:
  `sudo systemctl status postgresql`.
- **`relation "restaurants" does not exist`** — `npm run db:setup`
  hasn't been run yet.
- **`npm run db:setup` can't find `DATABASE_URL`** — `.env.local` is
  missing or misnamed; the script only reads it via
  `node --env-file=.env.local`.
- **`password authentication failed for user "postgres"`** — the
  password in `DATABASE_URL` doesn't match what you set when installing
  (Windows) or via `ALTER USER` (Linux). Fix one to match the other.
- **`role "postgres" does not exist"` on macOS** — Homebrew's Postgres
  doesn't create a `postgres` role by default; use the no-username
  connection string (`postgresql://localhost:5432/fiu_eats`) and
  `createdb`/`psql` without `-U postgres` instead.
- **Port `5432` already in use** — something else on the machine (maybe
  a previous Postgres install) is already listening on it. Find what's
  using it (`lsof -i :5432` on macOS/Linux) and stop it, or point
  `DATABASE_URL` at whichever instance is actually meant to be running.
- **New restaurant appears then vanishes on refresh** — `POST` is
  succeeding but `GET` and `POST` disagree on shape, or the form is
  still on the old React-state-only `onCreated` signature from Part 9.
- **`null value in column "..." violates not-null constraint`** — a
  required field wasn't sent from the client; the `if` check in `POST`
  should catch this before it reaches Postgres, so if you're seeing the
  raw Postgres error, double check the check is actually in place.
