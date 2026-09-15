export const PSX_PROFILES = {
  PS1_3D: { renderScale: 0.42, snap: 160 },
  RETRO8: { renderScale: 0.22, snap: 80 },
  HIGH_RES: { renderScale: 1, snap: 0 },
} as const;

export const PSX_VERTEX_SNAP = `
vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
vec4 clipPosition = projectionMatrix * mvPosition;
float snapRes = SNAP_RES;
vec2 ndc = clipPosition.xy / clipPosition.w;
ndc = floor(ndc * snapRes + 0.5) / snapRes;
clipPosition.xy = ndc * clipPosition.w;
gl_Position = clipPosition;
`;
