"use client";

import { ReactNode } from "react";
import { anton, jetbrainsMono } from "@/app/fonts";

type EmptyStateProps = {
  // Icon element shown above the title,
  icon: ReactNode;
  title: string;
  description: string;
  // Action button is only rendered when both of these are provided.
  actionLabel?: string;
  onAction?: () => void;
};

// Friendly placeholder shown when there are no restaurants to display
// (e.g. an empty favorites list, or a search with no matches).
export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="mt-10 rounded-lg border-2 border-dashed border-[#0B2340]/15 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B2340]/5 text-[#0B2340]/40">
        {icon}
      </div>

      <h3
        className={`${anton.className} mt-4 text-xl tracking-wide text-[#0B2340]`}
      >
        {title.toUpperCase()}
      </h3>
      <p className="mt-2 text-sm text-[#0B2340]/50">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`${jetbrainsMono.className} mt-5 rounded bg-[#0B2340] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#C89B3C] hover:text-[#0B2340]`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
