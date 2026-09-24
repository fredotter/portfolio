import { content } from "@/content";

// Link centers as a fraction of viewport width, read off the 1440px design (x ≈ 257, 587, 904, 1234).
const centers = ["17.85%", "40.76%", "62.78%", "85.69%"];

export function Nav() {
  return (
    <header>
      <nav aria-label="Main">
        <ul className="relative h-[98px] font-sans text-[13px] uppercase lg:text-[16px]">
          {content.nav.map((item, i) => (
            <li key={item.label} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: centers[i] }}>
              <a href={item.href} className="block px-1 py-2 leading-none transition-opacity hover:opacity-60">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
