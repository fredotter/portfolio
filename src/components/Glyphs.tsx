// Decorative starburst (✺), four-petal cross (✢) and outlined four-point star (✧).
// Sized in em so they scale with the adjacent name; bottom edge sits on the text baseline.

// Teardrop petal: pinched at the center, round at the tip
const petal = "M12 12C11.5 10.6 9.5 8.6 9.2 5.4A2.9 2.9 0 1 1 14.8 5.4C14.5 8.6 12.5 10.6 12 12Z";

export function Glyphs({ className = "" }: { className?: string }) {
  const svg = "inline-block h-[0.8em] w-[0.8em] align-baseline";
  return (
    <span aria-hidden="true" className={`inline-flex items-baseline gap-[3px] whitespace-nowrap ${className}`}>
      <svg viewBox="0 0 24 24" className={svg}>
        <g fill="currentColor">
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d="M10.9 1.4A1.1 1.1 0 0 1 13.1 1.4L12.15 11.2H11.85Z" transform={`rotate(${i * 22.5} 12 12)`} />
          ))}
        </g>
      </svg>
      <svg viewBox="0 0 24 24" className={svg} fill="currentColor">
        {[0, 90, 180, 270].map((r) => (
          <path key={r} d={petal} transform={`rotate(${r} 12 12)`} />
        ))}
        <circle cx="12" cy="12" r="1.6" />
      </svg>
      <svg viewBox="0 0 24 24" className={svg}>
        <path
          d="M12 1.5C12.6 8 16 11.4 22.5 12C16 12.6 12.6 16 12 22.5C11.4 16 8 12.6 1.5 12C8 11.4 11.4 8 12 1.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
