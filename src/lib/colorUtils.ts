type Rgb = [number, number, number]

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function lighten([r, g, b]: Rgb, amt: number): Rgb {
  return [
    Math.min(255, Math.round(r + (255 - r) * amt)),
    Math.min(255, Math.round(g + (255 - g) * amt)),
    Math.min(255, Math.round(b + (255 - b) * amt)),
  ]
}

function darken([r, g, b]: Rgb, amt: number): Rgb {
  return [Math.round(r * (1 - amt)), Math.round(g * (1 - amt)), Math.round(b * (1 - amt))]
}

function channels([r, g, b]: Rgb): string { return `${r} ${g} ${b}` }

export function brandCssVars(hex: string): Record<string, string> {
  const base = hexToRgb(hex)
  return {
    '--brand':       channels(base),
    '--brand-light': channels(lighten(base, 0.12)),
    '--brand-muted': channels(darken(base, 0.20)),
  }
}