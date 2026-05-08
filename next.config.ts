import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  httpAgentOptions: {
    keepAlive: true,
  },
  turbopack: {
    rules: {
      "*.svg": {
        as: "*.js",
        loaders: ["@svgr/webpack"],
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack(config: any, options: any) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
