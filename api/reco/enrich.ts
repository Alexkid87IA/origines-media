import type { VercelRequest, VercelResponse } from "@vercel/node";

interface EnrichResult {
  title: string;
  description: string;
  image: string;
  author: string;
  year: string;
  siteName: string;
  type: string;
}

function extractMeta(html: string, property: string): string {
  const patterns = [
    new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return "";
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m?.[1]?.trim() || "";
}

function guessTypeFromUrl(url: string): string {
  const u = url.toLowerCase();
  if (u.includes("spotify.com") || u.includes("music.apple.com") || u.includes("deezer.com") || u.includes("soundcloud.com")) return "musique";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("imdb.com") || u.includes("allocine.fr") || u.includes("netflix.com") || u.includes("disneyplus.com")) return "films-series";
  if (u.includes("amazon.") || u.includes("fnac.com")) return "produit";
  if (u.includes("podcasts.apple.com") || u.includes("open.spotify.com/show") || u.includes("open.spotify.com/episode")) return "podcasts";
  if (u.includes("instagram.com") || u.includes("tiktok.com") || u.includes("twitter.com") || u.includes("x.com") || u.includes("threads.net")) return "reseaux-sociaux";
  if (u.includes("goodreads.com") || u.includes("babelio.com")) return "livres";
  return "";
}

function extractYear(text: string): string {
  const m = text.match(/\b(19|20)\d{2}\b/);
  return m?.[0] || "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body as { url: string };
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL required" });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OriginesBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);

    const html = await response.text();

    const result: EnrichResult = {
      title: extractMeta(html, "og:title") || extractMeta(html, "twitter:title") || extractTitle(html),
      description: extractMeta(html, "og:description") || extractMeta(html, "twitter:description") || extractMeta(html, "description"),
      image: extractMeta(html, "og:image") || extractMeta(html, "twitter:image"),
      author: extractMeta(html, "music:musician") || extractMeta(html, "book:author") || extractMeta(html, "article:author") || extractMeta(html, "author"),
      year: extractMeta(html, "music:release_date") || extractMeta(html, "article:published_time") || "",
      siteName: extractMeta(html, "og:site_name") || "",
      type: guessTypeFromUrl(url),
    };

    if (!result.year && result.description) {
      result.year = extractYear(result.description);
    }

    if (result.title.length > 200) result.title = result.title.slice(0, 200);
    if (result.description.length > 500) result.description = result.description.slice(0, 500);

    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).json(result);
  } catch (err) {
    console.error("Enrich error:", err);
    return res.status(200).json({
      title: "",
      description: "",
      image: "",
      author: "",
      year: "",
      siteName: "",
      type: guessTypeFromUrl(url),
    });
  }
}
