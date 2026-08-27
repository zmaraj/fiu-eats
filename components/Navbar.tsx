"use client";

import { Plus } from "lucide-react";
import { anton, jetbrainsMono } from "@/app/fonts";

type NavbarProps = {
  // Which tab is currently selected.
  activeTab: "all" | "favorites" | "add";
  // Called with the new tab name whenever the user clicks a tab.
  onTabChange: (tab: "all" | "favorites" | "add") => void;
  // Number shown in the little badge next to "Favorites".
  favoritesCount: number;
};

// The dark bar pinned to the top of the page with the logo and tab links.
export default function Navbar({
  activeTab,
  onTabChange,
  favoritesCount,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-20 bg-[#0B2340] shadow-md shadow-black/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span
            className={`${anton.className} text-2xl tracking-wide text-white`}
          >
            FIU <span className="text-[#C89B3C]">EATS</span>
          </span>
        </div>

        <div
          className={`${jetbrainsMono.className} flex items-center gap-1 text-xs font-medium uppercase tracking-wider`}
        >
          <button
            onClick={() => onTabChange("all")}
            className={`border-b-2 px-3 py-2 transition ${
              activeTab === "all"
                ? "border-[#C89B3C] text-white"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            Restaurants
          </button>

          <button
            onClick={() => onTabChange("favorites")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 transition ${
              activeTab === "favorites"
                ? "border-[#C89B3C] text-white"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            Favorites
            {favoritesCount > 0 && (
              <span
                className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  activeTab === "favorites"
                    ? "bg-[#C89B3C] text-[#0B2340]"
                    : "bg-white/20 text-white"
                }`}
              >
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange("add")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 transition ${
              activeTab === "add"
                ? "border-[#C89B3C] text-white"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Restaurant
          </button>
        </div>
      </div>
    </nav>
  );
}
