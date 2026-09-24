import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { content } from "@/content";
import { Nav } from "@/components/Nav";
import { Glyphs } from "@/components/Glyphs";
import { AudienceSwitcher } from "@/components/AudienceSwitcher";
import { Footer } from "@/components/Footer";

// Swap to the real photo automatically once public/hero.jpg exists.
const hasHero = fs.existsSync(path.join(process.cwd(), "public", "hero.jpg"));

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1 px-[30px] pt-10 pb-24 lg:pt-[171px] lg:pr-[44px] lg:pb-[153px]">
        <div className="lg:grid lg:grid-cols-[1fr_auto] lg:items-start lg:gap-x-10">
          <div className="lg:col-start-1 lg:row-start-1">
            {/* 0.14em indent optically aligns the italic f's tail with the text below, as in the design */}
            <h1 className="pl-[0.14em] font-serif text-[length:var(--text-name)] leading-none italic lg:mt-[21px]">
              {content.name}
              {/* nbsp keeps the glyphs attached to the last word of the name */}
              &nbsp;<Glyphs className="text-[0.8em]" />
            </h1>
            <div className="font-serif">
              <AudienceSwitcher personas={content.personas} />
            </div>
          </div>

          <ul className="mt-6 flex flex-wrap gap-3 font-sans text-[16px] lowercase lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-end">
            {content.pills.map((pill) => (
              <li key={pill} className="flex h-[51px] items-center rounded-[14px] border border-ink px-4 leading-none">
                {pill}
              </li>
            ))}
          </ul>

          <div className="mt-8 aspect-[557/302] w-full lg:col-start-1 lg:row-start-2 lg:mt-[47px] lg:w-[557px]">
            {hasHero ? (
              <Image
                src="/hero.jpg"
                alt={content.heroAlt}
                width={1114}
                height={604}
                sizes="(min-width: 1024px) 557px, 100vw"
                preload
                className="h-full w-full object-cover"
              />
            ) : (
              <div role="img" aria-label={content.heroAlt} className="h-full w-full bg-[#c8cfcc]" />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
