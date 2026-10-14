import type { ReactNode } from "react";

const BOX =
  "mx-auto block h-auto max-h-[70vh] w-auto max-w-full rounded-xl border border-fd-border bg-black";

// A recording served from public/videos: an mp4 with a poster frame.
// preload="none" keeps a page light until the reader presses play. A narrower
// phone cut (phoneSrc) keeps terminal text readable on small screens. Both
// players are in the page and CSS shows one: only the shown one's video is
// fetched, but browsers fetch both posters (small WebP or JPEG frames).
// Terminal recordings are silent; the
// explainer film has narration with its captions burned into the picture.
export function Video({
  src,
  poster,
  title,
  width = 1100,
  height = 660,
  phoneSrc,
  phonePoster,
  phoneWidth = 520,
  phoneHeight = 760,
  children,
}: {
  src: string;
  poster: string;
  title: string;
  /** the recording's size in pixels, so the box keeps its shape before it loads */
  width?: number;
  height?: number;
  /** a smaller cut of the same recording for phones (520×760 by default) */
  phoneSrc?: string;
  phonePoster?: string;
  phoneWidth?: number;
  phoneHeight?: number;
  /** the caption under the video */
  children?: ReactNode;
}) {
  const player = (
    file: string,
    still: string,
    w: number,
    h: number,
    className: string,
  ) => (
    // biome-ignore lint/a11y/useMediaCaption: terminal recordings are silent and the explainer's captions are in the picture; the caption and the page around them give the same steps as text
    <video
      controls
      playsInline
      preload="none"
      poster={still}
      aria-label={title}
      width={w}
      height={h}
      className={`${BOX} ${className}`}
    >
      <source src={file} type="video/mp4" />
      <a href={file}>Download the video ({title})</a>
    </video>
  );
  return (
    <figure className="not-prose my-6">
      {phoneSrc && phonePoster ? (
        <>
          {player(src, poster, width, height, "max-sm:hidden")}
          {player(phoneSrc, phonePoster, phoneWidth, phoneHeight, "sm:hidden")}
        </>
      ) : (
        player(src, poster, width, height, "")
      )}
      {children ? (
        <figcaption className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
          {children}
        </figcaption>
      ) : null}
    </figure>
  );
}
