import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Smart Learning Games",
    short_name: "Smart Games",
    description: "Friendly multilingual learning games for Classes 1–7.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f6f7fc",
    theme_color: "#6d5dfc",
    categories: ["education", "games"],
    icons: [
      { src: "/icons/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
