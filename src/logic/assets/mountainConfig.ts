// Mountain scene config (no media included).
// Matches public/assets/manifests/assets.manifest.json mountain entries.
export const MOUNTAIN_SCENE = {
  id: 'mountain',
  parallax: {
    fg_rocks: 0.32,
    mid_slopes: 0.19,
    avatar_plane: 0.11,
    far_peaks: 0.05
  },
  lighting: {
    grade: 'dusk' as const,
    vignette: 0.10,
    fog: 0.20
  }
};
