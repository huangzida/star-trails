export type StarTrailsColorMode = 'single' | 'multi'
export type StarTrailsCenterMode = 'center' | 'mouse'
export type StarTrailsTrailType = 'radial' | 'concentric'
export type StarTrailsColorPalette = 'classic' | 'rainbow' | 'ocean' | 'fire'
export type StarTrailsRenderMode = 'persistence' | 'path'

export interface StarTrailsConfig {
  /**
   * Rotation speed of the stars
   * @default 1
   */
  rotateSpeed: number
  /**
   * Density of stars (0 to 1)
   * @default 0.5
   */
  density: number
  /**
   * Length of trails in persistence mode (0 to 1)
   * @default 0.5
   */
  trailLength: number
  /**
   * Base size of stars
   * @default 1
   */
  starSize: number
  /**
   * Color mode: single color or multicolor palette
   * @default 'single'
   */
  colorMode: StarTrailsColorMode
  /**
   * Color of stars in single mode
   * @default '#ffffff'
   */
  starColor: string
  /**
   * Speed of radial movement (in/out)
   * @default 0
   */
  radialSpeed: number
  /**
   * Glow effect intensity
   * @default 0
   */
  glow: number
  /**
   * Center point mode: fixed center or mouse follower
   * @default 'center'
   */
  centerMode: StarTrailsCenterMode
  /**
   * Enable long exposure effect (trails don't fade completely)
   * @default false
   */
  longExposure: boolean
  /**
   * Type of trail movement
   * @default 'concentric'
   */
  trailType: StarTrailsTrailType
  /**
   * Color palette for multi mode
   * @default 'classic'
   */
  colorPalette: StarTrailsColorPalette
  /**
   * Rendering mode: persistence (fading trails) or path (vector trails)
   * @default 'persistence'
   */
  renderMode: StarTrailsRenderMode
  /**
   * Length of path in path mode
   * @default 0
   */
  pathLength: number
  /**
   * Brightness of stars
   * @default 1
   */
  starBrightness: number
  /**
   * Twinkle effect intensity
   * @default 0
   */
  twinkle: number
  /**
   * Turbulence effect intensity
   * @default 0
   */
  turbulence: number
  /**
   * X coordinate of center (0 to 1)
   * @default 0.5
   */
  centerX: number
  /**
   * Y coordinate of center (0 to 1)
   * @default 0.5
   */
  centerY: number
}
