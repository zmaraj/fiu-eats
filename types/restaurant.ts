// Shape of a single restaurant. Defining this once means every component
// that receives a `restaurant` prop gets autocomplete + type checking on
// its fields, instead of everyone guessing at field names.
export type Restaurant = {
  id: number;
  name: string;
  category: string;
  rating: number;
  price: string;
  location: string;
  description: string;
};
