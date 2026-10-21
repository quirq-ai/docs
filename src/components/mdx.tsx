import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { BrandIcon } from "./brand-icon";
import { Card, Cards } from "./card";
import * as Figure from "./figure";
import { Journey, JourneyStep } from "./journey";
import { Lead } from "./lead";
import { Video } from "./video";
import { VideoEmbed } from "./video-embed";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    BrandIcon,
    Card,
    Cards,
    Journey,
    JourneyStep,
    Video,
    VideoEmbed,
    Lead,
    ...Figure,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
