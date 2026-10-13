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
      // Research pages that moved into the quirq section stay on this site.
      {
        source: "/research/phase-1-agentic-workforce/unit-of-work",
        destination: "/docs/quirq/what-is-quirq/unit-of-work",
        permanent: false,
      },
      {
        source:
          "/research/phase-1-agentic-workforce/unit-of-work-research/environment",
        destination: "/docs/quirq/what-is-quirq/environment",
        permanent: false,
      },
      {
        source: "/future-of-work/phase-1-agentic-workforce/unit-of-work",
        destination: "/docs/quirq/what-is-quirq/unit-of-work",
        permanent: false,
      },
      {
        source:
          "/future-of-work/phase-1-agentic-workforce/unit-of-work-research/environment",
        destination: "/docs/quirq/what-is-quirq/environment",
        permanent: false,
      },
      // XO docs moved to docs.xo.builders; send old links there.
      ...[
        ["/future-of-work/:path*", "/research/:path*"],
        ["/research/:path*", "/research/:path*"],
        ["/agents/:path*", "/docs/agents/:path*"],
        ["/more/:path*", "/more/:path*"],
        ["/getting-started", "/docs/cloud"],
        ["/docs/getting-started/:path*", "/docs/cloud/:path*"],
        ["/docs/cloud/:path*", "/docs/cloud/:path*"],
        ["/docs/space/:path*", "/docs/space/:path*"],
        ["/docs/agents/:path*", "/docs/agents/:path*"],
        ["/docs/setup/:path*", "/docs/setup/:path*"],
        ["/docs/troubleshooting/:path*", "/docs/troubleshooting/:path*"],
        ["/docs/more/:path*", "/docs/more/:path*"],
        ["/docs/changelog", "/docs/changelog"],
        ["/api-reference/:path*", "/api-reference/:path*"],
        ["/templates/:path*", "/templates/:path*"],
      ].map(([source, path]) => ({
        source,
        // Never fire on docs.xo.builders itself, so these can never loop.
        missing: [{ type: "host", value: "docs.xo.builders" }],
        destination: `https://docs.xo.builders${path}`,
        permanent: false,
      })),
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
