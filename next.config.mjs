import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  async redirects() {
    return [
      {
        source: "/start",
        destination: "/docs/start",
        permanent: false,
      },
      {
        source: "/future-of-work/:path*",
        destination: "/research/:path*",
        permanent: true,
      },
      {
        source: "/agents/:path*",
        destination: "/docs/agents/:path*",
        permanent: true,
      },
      {
        source: "/getting-started",
        destination: "/docs/cloud",
        permanent: true,
      },
      {
        source: "/docs/getting-started",
        destination: "/docs/cloud",
        permanent: true,
      },
      {
        source: "/docs/getting-started/:path*",
        destination: "/docs/cloud/:path*",
        permanent: true,
      },
      {
        source: "/docs/cloud/core-concepts",
        destination: "/docs/glossary",
        permanent: true,
      },
      {
        source: "/docs/getting-started/manage-workspace",
        destination: "/docs/cloud/manage-space",
        permanent: true,
      },
      {
        source: "/docs/cloud/manage-workspace",
        destination: "/docs/cloud/manage-space",
        permanent: true,
      },
      {
        source: "/more/create-your-alter-ego/:path*",
        destination: "/more/create-your-environments/:path*",
        permanent: true,
      },
      {
        source: "/docs/more/xo-cowork-api/:path*",
        destination: "/api-reference/:path*",
        permanent: true,
      },
      {
        source: "/more/xo-cowork-api/:path*",
        destination: "/api-reference/:path*",
        permanent: true,
      },
      {
        source: "/more/xo-mcp-server/:path*",
        destination: "/api-reference/xo-mcp-server/:path*",
        permanent: true,
      },
      {
        source: "/docs/more/xo-mcp-server/:path*",
        destination: "/api-reference/xo-mcp-server/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
    ];
  },
};

export default withMDX(config);
