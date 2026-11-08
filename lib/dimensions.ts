/**
 * Physical Artwork Dimension Helpers
 * Maps real-world physical dimensions (in cm) directly to 3D virtual museum units (1m = 1 Three.js unit).
 */

export interface Artwork3DDimensions {
  canvasW: number; // in meters (Three.js units)
  canvasH: number; // in meters (Three.js units)
  frameW: number;  // in meters (canvasW + 0.16 frame border)
  frameH: number;  // in meters (canvasH + 0.16 frame border)
  widthCm: number;
  heightCm: number;
}

const MAX_WALL_HEIGHT = 3.2; // Max frame height on gallery wall (corridor is 4.8m)
const MAX_WALL_WIDTH = 4.2;  // Max frame width on gallery wall
const MIN_DIMENSION = 0.5;   // Min size so small artworks are still clearly visible

/**
 * Extracts width and height in centimeters, prioritizing explicit fields,
 * falling back to string parsing e.g. "120 × 90 cm", and lastly aspect-ratio presets.
 */
export function parseArtworkDimensions(
  dimensionsStr?: string,
  width_cm?: number | null,
  height_cm?: number | null,
  aspectRatio?: string
): { widthCm: number; heightCm: number } {
  // 1. Direct explicit cm values from Admin
  const explicitW = typeof width_cm === 'number' && width_cm > 0 ? width_cm : null;
  const explicitH = typeof height_cm === 'number' && height_cm > 0 ? height_cm : null;
  if (explicitW && explicitH) {
    return { widthCm: explicitW, heightCm: explicitH };
  }

  // 2. Parse from dimensions string e.g. "120 × 90 cm", "120x90", "150 * 100"
  if (dimensionsStr && typeof dimensionsStr === 'string') {
    const match = dimensionsStr.match(/(\d+(?:\.\d+)?)\s*(?:[×xX*]|\bby\b)\s*(\d+(?:\.\d+)?)/);
    if (match) {
      const w = parseFloat(match[1]);
      const h = parseFloat(match[2]);
      if (w > 0 && h > 0) {
        return {
          widthCm: explicitW || w,
          heightCm: explicitH || h,
        };
      }
    }
  }

  // 3. Fallback based on aspectRatio preset
  if (aspectRatio === 'portrait') return { widthCm: 120, heightCm: 160 };
  if (aspectRatio === 'square') return { widthCm: 140, heightCm: 140 };
  if (aspectRatio === 'tall') return { widthCm: 100, heightCm: 180 };
  return { widthCm: 160, heightCm: 110 }; // landscape fallback
}

/**
 * Computes exact 3D canvas and outer frame dimensions for React Three Fiber meshes.
 * 100cm = 1.0 Three.js unit.
 */
export function computeArtwork3DDimensions(
  artwork: {
    dimensions?: string;
    width_cm?: number | null;
    height_cm?: number | null;
    aspectRatio?: string;
  }
): Artwork3DDimensions {
  const { widthCm, heightCm } = parseArtworkDimensions(
    artwork.dimensions,
    artwork.width_cm,
    artwork.height_cm,
    artwork.aspectRatio
  );

  // 1 meter = 1 Three.js 3D unit
  let cW = widthCm / 100;
  let cH = heightCm / 100;

  // Proportional clamping if dimensions exceed gallery wall limits
  if (cH > MAX_WALL_HEIGHT) {
    const scale = MAX_WALL_HEIGHT / cH;
    cW *= scale;
    cH = MAX_WALL_HEIGHT;
  }
  if (cW > MAX_WALL_WIDTH) {
    const scale = MAX_WALL_WIDTH / cW;
    cH *= scale;
    cW = MAX_WALL_WIDTH;
  }

  // Ensure minimum visibility for very small miniatures
  if (cH < MIN_DIMENSION && cW < MIN_DIMENSION) {
    const scale = MIN_DIMENSION / Math.max(cH, cW);
    cH *= scale;
    cW *= scale;
  }

  // Frame outer border adds 0.08m on each side (total 0.16m)
  const frameW = cW + 0.16;
  const frameH = cH + 0.16;

  return {
    canvasW: Number(cW.toFixed(3)),
    canvasH: Number(cH.toFixed(3)),
    frameW: Number(frameW.toFixed(3)),
    frameH: Number(frameH.toFixed(3)),
    widthCm,
    heightCm,
  };
}
