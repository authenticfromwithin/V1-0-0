// Snow scene config (no media included).
// Matches public/assets/manifests/assets.manifest.json snow entries.
export const SNOW_SCENE = {
  id: 'snow',
  parallax: {
    fg_pines: 0.34,
    mid_snowfield: 0.18,
    avatar_plane: 0.11,
    far_ridge: 0.045
  },
  lighting: {
    grade: 'blue_hour' as const,
    vignette: 0.12,
    fog: 0.22
  }
};
