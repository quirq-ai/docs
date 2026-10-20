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
      // Old qq guide, per-repo and start pages land on the page that now
      // covers them; the quirq proposal section was removed.
      ...[
        ["/start", "/docs/install"],
        ["/docs/start", "/docs/install"],
        ["/docs/qq", "/docs/install"],
        ["/docs/qq/cli", "/docs/commands"],
        ["/docs/qq/setup", "/docs/install#let-qq-setup-install-it-for-you"],
        [
          "/docs/qq/monitoring",
          "/docs/after-it-lands#6-see-it-all-in-one-place",
        ],
        ["/docs/qq/roadmap", "/docs/roadmap"],
        ...[
          "sync",
          "recipes",
          "toolchains",
          "remote-build",
          "infra-config",
          "gate",
          "test-pipelines",
          "gardener",
          "rollers",
          "release",
          "installer",
          "perf",
        ].map((repo) => [`/docs/qq/${repo}`, `/docs/infrastructure#${repo}`]),
        ["/docs/quirq", "/docs"],
        ["/docs/quirq/:path*", "/docs"],
        ["/research/phase-1-agentic-workforce/unit-of-work", "/docs"],
        [
          "/research/phase-1-agentic-workforce/unit-of-work-research/environment",
          "/docs",
        ],
        ["/future-of-work/phase-1-agentic-workforce/unit-of-work", "/docs"],
        [
          "/future-of-work/phase-1-agentic-workforce/unit-of-work-research/environment",
          "/docs",
        ],
      ].map(([source, destination]) => ({
        source,
        destination,
        permanent: false,
      })),
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
