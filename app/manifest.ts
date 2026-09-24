import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EliumNova",
    short_name: "EliumNova",
    start_url: "/",
    display: "standalone",
    background_color: "#050706",
    theme_color: "#050706",
    icons: [
      { src: "/img/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/img/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
