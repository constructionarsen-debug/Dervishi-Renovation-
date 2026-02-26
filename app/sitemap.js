export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const routes = [
    "/",
    "/about",
    "/projects",
    "/qa",
    "/ebooks",
    "/terms",
    "/privacy"
  ];

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/projects" ? "weekly" : "monthly",
    priority:
      path === "/" ? 1 :
      path === "/projects" ? 0.9 :
      path === "/qa" ? 0.85 :
      path === "/ebooks" ? 0.8 :
      0.7,
  }));
}