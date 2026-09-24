"use client";

import { useState } from "react";
import type { Persona } from "@/content";

export function AudienceSwitcher({ personas }: { personas: Persona[] }) {
  const [active, setActive] = useState(personas[0].key);
  // Only fade after a switch, so the first paint (and LCP) isn't delayed
  const [switched, setSwitched] = useState(false);
  const current = personas.find((p) => p.key === active) ?? personas[0];

  return (
    <>
      <p role="group" aria-label="Choose who this intro is for" className="text-[length:var(--text-body)] leading-[1.2]">
        for{" "}
        {personas.map((p, i) => {
          const isActive = p.key === active;
          return (
            <span key={p.key} className={isActive ? "text-ink" : "text-muted"}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActive(p.key);
                  setSwitched(true);
                }}
                className={`cursor-pointer transition-opacity hover:opacity-60 ${
                  isActive ? "underline decoration-1 underline-offset-[3px]" : ""
                }`}
              >
                {p.label}
              </button>
              {i < personas.length - 1 && ", "}
            </span>
          );
        })}
      </p>
      <div aria-live="polite">
        <p
          key={current.key}
          className={`mt-[6px] max-w-[700px] text-[length:var(--text-body)] leading-[1.2] ${
            switched ? "animate-fade-in motion-reduce:animate-none" : ""
          }`}
        >
          {current.blurb}
        </p>
      </div>
    </>
  );
}
