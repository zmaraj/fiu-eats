"use client";

import { FormEvent, useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import { anton, jetbrainsMono } from "@/app/fonts";
import { NewRestaurant } from "@/types/restaurant";

const priceOptions = ["$", "$$", "$$$"];

type AddRestaurantFormProps = {
  // Called with the fields the user typed in. The page decides how to
  // turn that into a full restaurant
  onCreated: (restaurant: NewRestaurant) => void;
};

const emptyForm: NewRestaurant = {
  name: "",
  category: "",
  price: "$",
  location: "",
  description: "",
};

// Form for adding a brand new restaurant. This only updates React state
// on the page above it, nothing here is saved to a server or a database,
// so a refresh (or opening the site on another device) loses it.
export default function AddRestaurantForm({
  onCreated,
}: AddRestaurantFormProps) {
  const [form, setForm] = useState<NewRestaurant>(emptyForm);
  const [justAdded, setJustAdded] = useState(false);

  const updateField = (field: keyof NewRestaurant, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onCreated(form);
    setForm(emptyForm);
    setJustAdded(true);
  };

  return (
    <div className="mx-auto mt-6 max-w-xl rounded-lg bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-t-lg bg-[#0B2340]">
        <UtensilsCrossed className="h-8 w-8 text-white/90" strokeWidth={1.5} />
      </div>

      <div className="border-t-2 border-dashed border-[#0B2340]/15" />

      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div>
          <h2
            className={`${anton.className} text-xl tracking-wide text-[#0B2340]`}
          >
            ADD A RESTAURANT
          </h2>
          <p className="mt-1 text-sm text-[#0B2340]/50">
            Know a spot that&apos;s missing? Add it below and it&apos;ll show up
            for everyone.
          </p>
        </div>

        <div>
          <label
            htmlFor="name"
            className={`${jetbrainsMono.className} text-xs font-bold uppercase tracking-wider text-[#0B2340]/70`}
          >
            Restaurant name
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="e.g. Chick-fil-A"
            className="mt-1.5 w-full rounded border border-[#0B2340]/15 bg-white px-3 py-2.5 text-sm text-[#0B2340] outline-none focus:border-[#C89B3C]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className={`${jetbrainsMono.className} text-xs font-bold uppercase tracking-wider text-[#0B2340]/70`}
            >
              Cuisine
            </label>
            <input
              id="category"
              required
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              placeholder="e.g. Mexican"
              className="mt-1.5 w-full rounded border border-[#0B2340]/15 bg-white px-3 py-2.5 text-sm text-[#0B2340] outline-none focus:border-[#C89B3C]"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className={`${jetbrainsMono.className} text-xs font-bold uppercase tracking-wider text-[#0B2340]/70`}
            >
              Price
            </label>
            <select
              id="price"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className="mt-1.5 w-full rounded border border-[#0B2340]/15 bg-white px-3 py-2.5 text-sm text-[#0B2340] outline-none focus:border-[#C89B3C]"
            >
              {priceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="location"
            className={`${jetbrainsMono.className} text-xs font-bold uppercase tracking-wider text-[#0B2340]/70`}
          >
            Location
          </label>
          <input
            id="location"
            required
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="e.g. FIU Graham Center"
            className="mt-1.5 w-full rounded border border-[#0B2340]/15 bg-white px-3 py-2.5 text-sm text-[#0B2340] outline-none focus:border-[#C89B3C]"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className={`${jetbrainsMono.className} text-xs font-bold uppercase tracking-wider text-[#0B2340]/70`}
          >
            Description
          </label>
          <textarea
            id="description"
            required
            rows={3}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="What should people know about it?"
            className="mt-1.5 w-full rounded border border-[#0B2340]/15 bg-white px-3 py-2.5 text-sm text-[#0B2340] outline-none focus:border-[#C89B3C]"
          />
        </div>

        {justAdded && (
          <p className="text-sm text-emerald-600">
            Added! Check the Restaurants tab to see it.
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded bg-[#0B2340] py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#C89B3C] hover:text-[#0B2340]"
        >
          Add Restaurant
        </button>
      </form>
    </div>
  );
}
