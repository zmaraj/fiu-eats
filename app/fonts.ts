// Shared fonts for the whole app.
//
// Every component that needs a "display" heading or a "label" style was
// re-creating these same two fonts on its own. Next.js font loaders should
// only be called once per font, so we do it here and import the result
// everywhere else instead of repeating this setup in every file.
import { Anton, JetBrains_Mono } from "next/font/google";

// Big bold display font used for headings
export const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap" });

// Monospace font used for small uppercase labels/badges
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});
