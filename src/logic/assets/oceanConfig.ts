// Ocean scene config (no media included).
// Matches public/assets/manifests/assets.manifest.json ocean entries.
export const OCEAN_SCENE = {
  id: 'ocean',
  parallax: {
    shoreline_fg: 0.33,
    waves_mid: 0.18,
    avatar_plane: 0.10,
    horizon: 0.04
  },
  lighting: {
    grade: 'dawn' as const,
    vignette: 0.08,
    fog: 0.18
  }
};
