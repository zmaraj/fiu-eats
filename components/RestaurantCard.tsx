"use client";

import { Heart, MapPin, UtensilsCrossed } from "lucide-react";
import { Restaurant } from "@/types/restaurant";
import { anton, jetbrainsMono } from "@/app/fonts";

type RestaurantCardProps = {
  restaurant: Restaurant;
  isFavorite: boolean;
  // Called with the restaurant's id when the heart button is clicked.
  onToggleFavorite: (id: number) => void;
  // Called with the full restaurant when "View Restaurant" is clicked,
  // which opens the detail modal.
  onView: (restaurant: Restaurant) => void;
};

// A single restaurant preview shown in the grid on the home page.
export default function RestaurantCard({
  restaurant,
  isFavorite,
  onToggleFavorite,
  onView,
}: RestaurantCardProps) {
  return (
    <div className="group relative overflow-visible rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Image block (we don't have real photos, so this is a styled placeholder) */}
      <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-t-lg bg-[#0B2340]">
        <UtensilsCrossed className="h-12 w-12 text-white/90" strokeWidth={1.5} />

        <button
          onClick={() => onToggleFavorite(restaurant.id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:scale-110 hover:bg-white/25"
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-[#C89B3C] text-[#C89B3C]" : ""}`}
          />
        </button>

        <span
          className={`${jetbrainsMono.className} absolute left-3 top-3 rounded bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur`}
        >
          #{String(restaurant.id).padStart(2, "0")}
        </span>
      </div>

      {/* Perforated ticket edge with hole-punch notches */}
      <div className="relative border-t-2 border-dashed border-[#0B2340]/15">
        <span className="absolute -left-[9px] -top-[9px] h-[18px] w-[18px] rounded-full bg-[#F6F7F5]" />
        <span className="absolute -right-[9px] -top-[9px] h-[18px] w-[18px] rounded-full bg-[#F6F7F5]" />
      </div>

      {/* Card content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`${anton.className} text-lg leading-tight tracking-wide text-[#0B2340]`}
          >
            {restaurant.name.toUpperCase()}
          </h3>

          <div
            className={`${jetbrainsMono.className} flex h-9 w-9 shrink-0 rotate-3 items-center justify-center rounded-full border-2 border-[#C89B3C] text-[11px] font-bold text-[#0B2340]`}
          >
            {restaurant.rating ?? "New"}
          </div>
        </div>

        <p
          className={`${jetbrainsMono.className} mt-1.5 text-[11px] font-bold uppercase tracking-wider text-[#C89B3C]`}
        >
          {restaurant.category} · {restaurant.price}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#0B2340]/60">
          {restaurant.description}
        </p>

        <p className="mt-3 flex items-center gap-1 text-xs text-[#0B2340]/50">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {restaurant.location}
        </p>

        <button
          onClick={() => onView(restaurant)}
          className="mt-5 w-full rounded bg-[#0B2340] py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#C89B3C] hover:text-[#0B2340]"
        >
          View Restaurant →
        </button>
      </div>
    </div>
  );
}
