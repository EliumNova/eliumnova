import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera un sitio estático en /out, listo para Netlify o cualquier hosting.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
