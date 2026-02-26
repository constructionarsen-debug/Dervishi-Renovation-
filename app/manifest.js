export default function manifest() {
  return {
    name: "Dervishi Renovation",
    short_name: "Dervishi",
    description:
      "Renovim apartamentesh, shtëpish, zyrash dhe interiere moderne në Tiranë dhe Shqipëri.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0f",
    theme_color: "#0b0b0f",
    lang: "sq-AL",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}