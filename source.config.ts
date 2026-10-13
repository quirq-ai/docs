import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";

// You can customize Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

const researchPageSchema = pageSchema.extend({
  tags: z.array(z.string()).optional(),
  date: z.string().optional(),
  // Opt in to a single typeface for the whole article — neutralizes the
  // preflight monospace on code/kbd/samp/pre inside this page only.
  singleFont: z.boolean().optional(),
});

export const researchDocs = defineDocs({
  dir: "content/research",
  docs: {
    schema: researchPageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
