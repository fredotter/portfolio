"""Measure ink bounding boxes of each landing-page element in a 1440px screenshot.

Usage: python scripts/measure.py reference.png [candidate.png]
With two images, prints per-element deltas and flags any edge off by more than 4px.
"""
import sys
from PIL import Image

# name: (x0, y0, x1, y1, mode) — mode "dark" finds dark ink on white, "light" finds light ink on black
REGIONS = {
    "nav WORK":       (180, 25, 340, 75, "dark"),
    "nav PLAY":       (500, 25, 680, 75, "dark"),
    "nav ME":         (820, 25, 990, 75, "dark"),
    "nav RESUME":     (1140, 25, 1330, 75, "dark"),
    "name + glyphs":  (20, 260, 480, 346, "dark"),
    "audience line":  (20, 347, 760, 386, "dark"),
    "intro":          (20, 387, 760, 450, "dark"),
    "pill 1 border":  (900, 255, 1440, 324, "dark"),
    "pill 2 border":  (900, 325, 1440, 400, "dark"),
    "hero image":     (0, 455, 900, 900, "nonwhite"),
    "footer name":    (40, 985, 400, 1042, "light"),
    "footer made-with": (40, 1045, 560, 1085, "light"),
    "footer col 1":   (560, 990, 800, 1110, "light"),
    "footer col 2":   (800, 990, 1000, 1110, "light"),
}


def lum(p):
    return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]


def bbox(img, x0, y0, x1, y1, mode):
    px = img.load()
    xs, ys = [], []
    for y in range(y0, min(y1, img.height)):
        for x in range(x0, min(x1, img.width)):
            l = lum(px[x, y])
            hit = l < 128 if mode == "dark" else l > 128 if mode == "light" else l < 245
            if hit:
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def footer_top(img):
    px = img.load()
    for y in range(600, img.height):
        if lum(px[720, y]) < 20:
            return y
    return None


def measure(path):
    img = Image.open(path).convert("RGB")
    out = {k: bbox(img, *v) for k, v in REGIONS.items()}
    out["footer top (x=720)"] = footer_top(img)
    return out


def main():
    ref = measure(sys.argv[1])
    cand = measure(sys.argv[2]) if len(sys.argv) > 2 else None
    worst = 0
    for k, r in ref.items():
        if cand is None:
            print(f"{k:22} {r}")
            continue
        c = cand[k]
        if r is None or c is None:
            print(f"{k:22} ref={r} cand={c}  MISSING")
            continue
        if isinstance(r, int):
            d = (c - r,)
            label = "top"
        else:
            # left, top, right, bottom deltas (right edge excluded for text: widths aren't pass/fail)
            d = tuple(ci - ri for ci, ri in zip(c, r))
            label = "l,t,r,b"
        flag = "  <-- >4px" if any(abs(v) > 4 for v in (d if k in ("hero image", "pill 1 border", "pill 2 border") or isinstance(r, int) else (d[0], d[1], d[3]))) else ""
        worst = max(worst, *(abs(v) for v in d))
        print(f"{k:22} ref={r} cand={c}  Δ{label}={d}{flag}")


if __name__ == "__main__":
    main()
