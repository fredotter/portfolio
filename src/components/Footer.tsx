import { content } from "@/content";
import { Glyphs } from "./Glyphs";

const link = "block leading-5 transition-opacity hover:opacity-60";

export function Footer() {
  const resume = content.nav.find((n) => n.label === "RESUME")?.href ?? "/resume.pdf";
  const primary = [
    { label: "SAY HI", href: content.footer.email },
    { label: "LINKEDIN", href: content.footer.linkedin },
    { label: "RESUME", href: resume },
  ];
  const pages = content.nav.filter((n) => n.label !== "RESUME");

  return (
    <footer className="min-h-[355px] rounded-t-[40px] bg-black px-[30px] pt-[46px] pb-16 font-mono text-[15px] tracking-[0.05em] text-white uppercase lg:grid lg:grid-cols-[50px_calc(40.764%-50px)_16.25%_1fr] lg:rounded-t-[80px] lg:px-0">
      <div className="lg:col-start-2">
        <p className="font-serif text-[length:var(--text-footer-name)] leading-none tracking-normal normal-case italic">
          {content.name}&nbsp;<Glyphs />
        </p>
        <p className="mt-[11px] leading-5">MADE WITH &lt;3 FROM {content.city}</p>
      </div>
      <div className="mt-10 grid grid-cols-[auto_auto] justify-start gap-x-20 lg:contents">
        <ul className="flex flex-col gap-[18px] lg:pt-[1px]">
          {primary.map((l) => (
            <li key={l.label}>
              <a href={l.href} className={link}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-[18px] lg:pt-[1px]">
          {pages.map((l) => (
            <li key={l.label}>
              <a href={l.href} className={link}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
