"use client";

import { jetbrainsMono } from "@/app/fonts";

type CategoryFilterProps = {
  // All category options to show as buttons (including "All").
  categories: string[];
  // The currently selected category, used to highlight its button.
  selected: string;
  // Called with the clicked category's name.
  onSelect: (category: string) => void;
};

// Row of pill buttons for filtering restaurants by category.
export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div
      className={`${jetbrainsMono.className} flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider`}
    >
      {categories.map((category) => {
        const active = selected === category;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            aria-pressed={active}
            className={`rounded px-4 py-2 transition ${
              active
                ? "bg-[#0B2340] text-white"
                : "border border-[#0B2340]/15 bg-white text-[#0B2340]/70 hover:border-[#C89B3C] hover:text-[#0B2340]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
