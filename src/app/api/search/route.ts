import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// TODO: extend to search across researchSource
// once fumadocs multi-source search API is confirmed
export const { GET } = createFromSource(source, {
  language: "english",
});
