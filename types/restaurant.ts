// Shape of a single restaurant. Defining this once means every component
// that receives a `restaurant` prop gets autocomplete + type checking on
// its fields, instead of everyone guessing at field names.
export type Restaurant = {
  id: number;
  name: string;
  category: string;
  // Null until someone rates it — restaurants added through the form
  // start out unrated.
  rating: number | null;
  price: string;
  location: string;
  description: string;
};

// Fields the "Add a restaurant" form collects. The server fills in
// `id` and `rating` (null) when it inserts the row.
export type NewRestaurant = {
  name: string;
  category: string;
  price: string;
  location: string;
  description: string;
};
