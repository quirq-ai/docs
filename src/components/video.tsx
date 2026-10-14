import type { ReactNode } from "react";

// A recording served from public/videos: an mp4 with a poster frame, no sound.
// preload="none" keeps a page light until the reader presses play.
export function Video({
  src,
  poster,
  title,
  width = 1100,
  height = 660,
  children,
}: {
  src: string;
  poster: string;
  title: string;
  /** the recording's size in pixels, so the box keeps its shape before it loads */
  width?: number;
  height?: number;
  /** the caption under the video */
  children?: ReactNode;
}) {
  return (
    <figure className="not-prose my-6">
      {/* biome-ignore lint/a11y/useMediaCaption: the recordings have no sound; the caption and the page around them give the same steps as text */}
      <video
        controls
        playsInline
        preload="none"
        poster={poster}
        aria-label={title}
        width={width}
        height={height}
        className="block h-auto w-full rounded-xl border border-fd-border bg-black"
      >
        <source src={src} type="video/mp4" />
        <a href={src}>Download the video ({title})</a>
      </video>
      {children ? (
        <figcaption className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
          {children}
        </figcaption>
      ) : null}
    </figure>
  );
}
