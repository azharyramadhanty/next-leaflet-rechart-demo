import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://smartbunker-pis.southeastasia.cloudapp.azure.com" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://api.maptiler.com https://unpkg.com;
            style-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com;
            font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
            img-src 'self' data: https://cdnjs.cloudflare.com https://api.maptiler.com https://sadevmvplanding.blob.core.windows.net https://login-v3.qa.idaman.pertamina.com;
            connect-src 'self' https://smartbunker-pis.southeastasia.cloudapp.azure.com https://login-v3.qa.idaman.pertamina.com https://cdnjs.cloudflare.com https://api.maptiler.com https://unpkg.com;
            frame-ancestors 'none';
            upgrade-insecure-requests;
            `.replace(/\s{2,}/g, " ").trim()
          },
          { key: "Cache-Control", value: "private, max-age=31536000" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" }
        ]
      }
    ]
  },
};

export default nextConfig;
