"use client";

import { useEffect } from "react";
import { Heart, MapPin, UtensilsCrossed, X } from "lucide-react";
import { Restaurant } from "@/types/restaurant";
import { anton, jetbrainsMono } from "@/app/fonts";

type RestaurantModalProps = {
  // The restaurant to show details for, or null when the modal is closed.
  restaurant: Restaurant | null;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClose: () => void;
};

// Popup with full details for one restaurant. Renders nothing when
// `restaurant` is null, so it can always be mounted in the page.
export default function RestaurantModal({
  restaurant,
  isFavorite,
  onToggleFavorite,
  onClose,
}: RestaurantModalProps) {
  // Close on Escape, and stop the page from scrolling behind the modal
  // while it's open.
  useEffect(() => {
    if (!restaurant) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [restaurant, onClose]);

  if (!restaurant) return null;

  return (
    // Clicking the dark backdrop closes the modal; clicking inside the
    // card itself does not (see stopPropagation below).
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="restaurant-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-visible rounded-lg bg-white shadow-2xl"
      >
        <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-t-lg bg-[#0B2340]">
          <UtensilsCrossed
            className="h-16 w-16 text-white/90"
            strokeWidth={1.5}
          />

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:scale-110 hover:bg-white/25"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-t-2 border-dashed border-[#0B2340]/15" />

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2
                id="restaurant-modal-title"
                className={`${anton.className} text-2xl tracking-wide text-[#0B2340]`}
              >
                {restaurant.name.toUpperCase()}
              </h2>
              <p
                className={`${jetbrainsMono.className} mt-1.5 text-xs font-bold uppercase tracking-wider text-[#C89B3C]`}
              >
                {restaurant.category} · {restaurant.price}
              </p>
            </div>

            <div
              className={`${jetbrainsMono.className} flex h-11 w-11 shrink-0 rotate-3 items-center justify-center rounded-full border-2 border-[#C89B3C] text-sm font-bold text-[#0B2340]`}
            >
              {restaurant.rating ?? "New"}
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#0B2340]/60">
            {restaurant.description}
          </p>

          <p className="mt-3 flex items-center gap-1 text-xs text-[#0B2340]/50">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {restaurant.location}
          </p>

          <button
            onClick={() => onToggleFavorite(restaurant.id)}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded py-3 text-xs font-bold uppercase tracking-wider transition ${
              isFavorite
                ? "bg-[#F6E9CB] text-[#0B2340]"
                : "bg-[#0B2340] text-white hover:bg-[#C89B3C] hover:text-[#0B2340]"
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}
