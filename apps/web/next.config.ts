import type { NextConfig } from "next";

const cmsUrl = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL;

function getCmsImageRemotePattern() {
  if (!cmsUrl) return undefined;

  try {
    const url = new URL(cmsUrl);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: "/uploads/**",
    };
  } catch {
    return undefined;
  }
}

const cmsImageRemotePattern = getCmsImageRemotePattern();

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
      ...(cmsImageRemotePattern ? [cmsImageRemotePattern] : []),
    ],
  },
};

export default nextConfig;
