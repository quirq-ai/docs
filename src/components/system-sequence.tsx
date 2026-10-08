"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const stageDetails = [
  {
    name: "Runtime",
    label: "Foundation / compute chassis",
    description:
      "The local machine or cloud infrastructure that supplies compute and hosts a Space.",
    icon: "icon-[ph--hard-drives-fill]",
    imageName: "runtime",
  },
  {
    name: "Space",
    label: "Transparent architectural container",
    description:
      "The environment that holds the tools, memory, permissions, and state an agent needs to work.",
    icon: "icon-[ph--squares-four-fill]",
    imageName: "space",
  },
  {
    name: "Agent",
    label: "Swappable computational module",
    description:
      "The model harness that operates inside a Space and can be changed without changing the environment.",
    icon: "icon-[ph--robot-fill]",
    imageName: "agent",
  },
  {
    name: "Work",
    label: "Tangible output artifacts",
    description:
      "The delivered outcome: code, documents, decisions, reports, or completed operational tasks.",
    icon: "icon-[ph--briefcase-fill]",
    imageName: "work",
  },
  {
    name: "quirqs",
    label: "A proposed unit for work",
    description:
      "A proposed way to count checked, delivered work, not just model use. XO Space does not count quirqs yet.",
    icon: "icon-[ph--gauge-fill]",
    imageName: "quirqs",
  },
] as const;

const stages = stageDetails.map((stage) => ({
  ...stage,
  image: `/images/system-${stage.imageName}.png`,
}));

export function SystemSequence() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const activeStage = stages[active];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const index = Number(visible.target.getAttribute("data-stage"));
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0.1, 0.5, 0.9] },
    );

    stepRefs.current.forEach((step) => {
      if (step) observer.observe(step);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-y border-fd-border bg-[#05080c] text-white">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-primary">
            How the system takes shape
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
            One system, from runtime to result.
          </h2>
          <p className="mt-5 leading-7 text-white/65">
            Scroll through the five layers. Each one adds a necessary part of
            the system; together they make agentic work runnable and legible.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="space-y-[40vh] pb-[20vh] lg:py-[18vh]">
            {stages.map((stage, index) => (
              <article
                key={stage.name}
                ref={(element) => {
                  stepRefs.current[index] = element;
                }}
                data-stage={index}
                className="scroll-mt-28"
              >
                <div
                  className={`border-l-2 pl-5 transition-colors duration-500 motion-reduce:transition-none ${
                    active === index ? "border-fd-primary" : "border-white/15"
                  }`}
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-lg border transition-colors duration-500 motion-reduce:transition-none ${
                      active === index
                        ? "border-fd-primary/40 bg-fd-primary text-fd-primary-foreground"
                        : "border-white/10 bg-white/5 text-white/50"
                    }`}
                  >
                    <span className={`${stage.icon} size-5`} />
                  </span>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-fd-primary">
                    {stage.label}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                    {stage.name}
                  </h3>
                  <p className="mt-4 max-w-sm leading-7 text-white/65">
                    {stage.description}
                  </p>
                  <Image
                    src={stage.image}
                    alt={`${stage.name}: ${stage.label}`}
                    width={1536}
                    height={1024}
                    sizes="100vw"
                    className="mt-7 rounded-xl border border-white/10 lg:hidden"
                    priority={index === 0}
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/40">
              <div className="relative aspect-square">
                <Image
                  key={activeStage.image}
                  src={activeStage.image}
                  alt={`${activeStage.name}: ${activeStage.label}`}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-contain"
                  priority={active === 0}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-black/70 px-5 py-4 backdrop-blur-sm">
                <span className="text-sm font-semibold">
                  {stages[active].name}
                </span>
                <span className="text-xs text-white/55">
                  {active + 1} / {stages.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
