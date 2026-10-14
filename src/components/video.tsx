import type { ReactNode } from "react";

const BOX =
  "mx-auto block h-auto max-h-[70vh] w-auto max-w-full rounded-xl border border-fd-border bg-black";

// A recording served from public/videos: an mp4 with a poster frame, no sound.
// preload="none" keeps a page light until the reader presses play. A narrower
// phone cut (phoneSrc) keeps terminal text readable on small screens; only the
// one that is shown is ever fetched.
export function Video({
  src,
  poster,
  title,
  width = 1100,
  height = 660,
  phoneSrc,
  phonePoster,
  children,
}: {
  src: string;
  poster: string;
  title: string;
  /** the recording's size in pixels, so the box keeps its shape before it loads */
  width?: number;
  height?: number;
  /** a 520×760 cut of the same recording for phones */
  phoneSrc?: string;
  phonePoster?: string;
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
    // biome-ignore lint/a11y/useMediaCaption: the recordings have no sound; the caption and the page around them give the same steps as text
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
          {player(phoneSrc, phonePoster, 520, 760, "sm:hidden")}
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
