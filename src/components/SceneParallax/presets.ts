export type Layer = { src?: string; depth: number; opacity?: number };

export function buildLayers(): Layer[] {
  const theme = (document.documentElement.getAttribute('data-theme') || 'forest');
  const base = `/assets/scenes/${theme}/plates`;
  return [
    { src: `${base}/back.webp`, depth: 0.3, opacity: 1 },
    { src: `${base}/mid.webp`,  depth: 0.7, opacity: 1 },
    { src: `${base}/front.webp`, depth: 1.1, opacity: 1 },
  ];
}
