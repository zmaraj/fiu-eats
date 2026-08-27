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
