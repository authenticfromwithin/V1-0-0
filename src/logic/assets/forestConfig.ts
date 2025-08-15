// Forest scene config (no media included).
// Matches public/assets/manifests/assets.manifest.json forest entries.
export const FOREST_SCENE = {
  id: 'forest',
  parallax: {
    fg_branches: 0.35,
    mid_trees: 0.20,
    avatar_plane: 0.12,
    far_horizon: 0.05
  },
  lighting: {
    grade: 'night' as const,
    vignette: 0.12,
    fog: 0.25
  }
};
