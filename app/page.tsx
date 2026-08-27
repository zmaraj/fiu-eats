"use client";

import { useEffect, useState } from "react";
import { Heart, Search, UtensilsCrossed } from "lucide-react";
import { NewRestaurant, Restaurant } from "@/types/restaurant";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import RestaurantCard from "@/components/RestaurantCard";
import RestaurantModal from "@/components/RestaurantModal";
import AddRestaurantForm from "@/components/AddRestaurantForm";
import EmptyState from "@/components/EmptyState";
import { anton, jetbrainsMono } from "@/app/fonts";
import { initialRestaurants } from "@/data/restaurants";

const categories = ["All", "Asian", "Mexican", "American", "Coffee"];

// Key used to save/load favorites in the browser's localStorage, so they
// survive a page refresh (but only on this one browser/device).
const FAVORITES_STORAGE_KEY = "fiu-eats-favorites";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "add">(
    "all"
  );
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  // The restaurant list starts out as this hardcoded array and only ever
  // changes in React state. Nothing here is saved anywhere else, so a
  // page refresh or opening the site in another tab resets it back to
  // the starter list.
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>(initialRestaurants);

  // Called by the "Add Restaurant" form with just the fields the user
  // typed in.
  const handleCreated = (restaurant: NewRestaurant) => {
    setRestaurants((current) => [
      ...current,
      {
        ...restaurant,
        id: current.length > 0 ? Math.max(...current.map((r) => r.id)) + 1 : 1,
        rating: null,
      },
    ]);
  };

  // Tracks whether we already read favorites from localStorage, so the
  // save effect below doesn't immediately overwrite them with an empty
  // list before the load has finished.
  const [hasLoadedFavorites, setHasLoadedFavorites] = useState(false);

  // Load saved favorites once on mount so they survive a page refresh.
  // This is where a real app would fetch from a database instead.
  //
  // This has to run in an effect (not during render) because `window`
  // doesn't exist while Next.js renders the page on the server.
  useEffect(() => {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, an external system, on mount
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
    setHasLoadedFavorites(true);
  }, []);

  // Whenever favorites change, save them back to localStorage.
  useEffect(() => {
    if (!hasLoadedFavorites) return;
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites, hasLoadedFavorites]);

  // Adds/removes a restaurant id from the favorites list.
  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id]
    );
  };

  // Start from either every restaurant, or just the favorited ones,
  // depending on which tab is active.
  const baseList =
    activeTab === "favorites"
      ? restaurants.filter((r) => favorites.includes(r.id))
      : restaurants;

  // Then narrow that list down by the search box and category filter.
  const filteredRestaurants = baseList.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || restaurant.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
  };

  return (
    <main className="min-h-screen bg-[#F6F7F5] text-[#0B2340]">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={favorites.length}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B2340]">
        {/* Decorative background circles, hidden from screen readers */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C89B3C]/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-40 h-40 w-40 rounded-full bg-[#C89B3C]/10"
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16">
          <div className="max-w-2xl">
            <div
              className={`${jetbrainsMono.className} mb-4 inline-flex items-center gap-2 rounded border border-[#C89B3C]/40 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C89B3C]`}
            >
              <UtensilsCrossed className="h-3.5 w-3.5" />
              Food around FIU
            </div>

            <h1
              className={`${anton.className} text-5xl leading-none tracking-wide text-white sm:text-6xl`}
            >
              FIND YOUR NEXT
              <br />
              <span className="text-[#C89B3C]">MEAL</span>.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-white/60">
              Discover restaurants, coffee shops, and places to eat around
              campus.
            </p>

            <div className="relative mt-8 max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants..."
                aria-label="Search restaurants"
                className="w-full rounded border-2 border-dashed border-white/20 bg-white/5 py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur transition focus:border-[#C89B3C] focus:bg-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        {activeTab === "add" ? (
          <AddRestaurantForm
            onCreated={(restaurant) => {
              handleCreated(restaurant);
              setActiveTab("all");
            }}
          />
        ) : (
          <>
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            <div className="mt-10 flex items-end justify-between">
              <div>
                <h2 className={`${anton.className} text-2xl tracking-wide`}>
                  {activeTab === "favorites" ? "FAVORITES" : "RESTAURANTS"}
                </h2>

                <p
                  className={`${jetbrainsMono.className} mt-1 text-xs font-bold uppercase tracking-wider text-[#0B2340]/40`}
                >
                  {`${filteredRestaurants.length} ${
                    filteredRestaurants.length === 1
                      ? "restaurant"
                      : "restaurants"
                  } found`}
                </p>
              </div>
            </div>

            {filteredRestaurants.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    isFavorite={favorites.includes(restaurant.id)}
                    onToggleFavorite={toggleFavorite}
                    onView={setSelectedRestaurant}
                  />
                ))}
              </div>
            ) : activeTab === "favorites" ? (
              <EmptyState
                icon={<Heart className="h-8 w-8" />}
                title="No favorites yet"
                description="Tap the heart on any restaurant to save it here."
                actionLabel="Browse restaurants"
                onAction={() => setActiveTab("all")}
              />
            ) : (
              <EmptyState
                icon={<Search className="h-8 w-8" />}
                title="No restaurants found"
                description="Try searching for something else or choose another category."
                actionLabel="Clear filters"
                onAction={clearFilters}
              />
            )}
          </>
        )}
      </section>

      <RestaurantModal
        restaurant={selectedRestaurant}
        isFavorite={
          selectedRestaurant ? favorites.includes(selectedRestaurant.id) : false
        }
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedRestaurant(null)}
      />
    </main>
  );
}
