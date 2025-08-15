// Autumn scene config (no media included).
// Matches public/assets/manifests/assets.manifest.json autumn entries.
export const AUTUMN_SCENE = {
  id: 'autumn',
  parallax: {
    fg_leaves: 0.34,
    mid_trees: 0.20,
    avatar_plane: 0.12,
    far_hills: 0.05
  },
  lighting: {
    grade: 'golden_hour' as const,
    vignette: 0.08,
    fog: 0.15
  }
};
