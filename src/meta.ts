import type { EffectMeta } from '@bg-effects/core'
import type { StarTrailsConfig } from './types'

export const meta: EffectMeta<StarTrailsConfig> = {
  id: 'star-trails',
  name: {
    en: 'Star Trails',
    'zh-CN': '星轨'
  },
  category: 'space',
  version: '1.0.0',
  defaultConfig: {
    rotateSpeed: 1.0,
    density: 0.5,
    trailLength: 0.95,
    starSize: 1.0,
    colorMode: 'multi',
    starColor: '#ffffff',
    radialSpeed: 0.0,
    glow: 0.5,
    centerMode: 'center',
    longExposure: false,
    trailType: 'radial',
    colorPalette: 'classic',
    renderMode: 'path',
    pathLength: 0.5,
    starBrightness: 1.0,
    twinkle: 0.2,
    turbulence: 0.0,
    centerX: 0.5,
    centerY: 0.5,
  },
  randomize: (config, tab) => {
    const rnd = (min: number, max: number) => min + Math.random() * (max - min)
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
    const pickBool = (p = 0.5) => Math.random() < p

    const all = (): Partial<StarTrailsConfig> => {
      const colorMode = pickBool(0.6) ? 'multi' : 'single'
      return {
        rotateSpeed: rnd(0.5, 3),
        density: rnd(0.5, 2),
        trailLength: rnd(0.9, 0.999),
        starSize: rnd(0.5, 2),
        colorMode,
        starColor: pick(['#ffffff', '#00d4ff', '#7c3aed', '#ff00ff', '#00ffff']),
        radialSpeed: rnd(-0.05, 0.05),
        glow: rnd(0, 1.5),
        longExposure: pickBool(0.5),
        trailType: pickBool(0.5) ? 'radial' : 'concentric',
        colorPalette: pick(['classic', 'rainbow', 'ocean', 'fire']) as any,
        renderMode: pickBool(0.7) ? 'path' : 'persistence',
        pathLength: rnd(0.2, 1),
        starBrightness: rnd(0.5, 1),
        twinkle: rnd(0, 0.5),
        turbulence: rnd(0, 2),
        centerMode: pickBool(0.8) ? 'center' : 'mouse',
        centerX: rnd(0.3, 0.7),
        centerY: rnd(0.3, 0.7),
      }
    }

    const byTab: Record<string, () => Partial<StarTrailsConfig>> = {
      render: () => ({
        renderMode: pickBool(0.7) ? 'path' : 'persistence',
        longExposure: pickBool(0.5),
        trailLength: rnd(0.9, 0.999),
        pathLength: rnd(0.2, 1),
      }),
      trail: () => ({
        trailType: pickBool(0.5) ? 'radial' : 'concentric',
        radialSpeed: rnd(-0.05, 0.05),
        rotateSpeed: rnd(0.5, 3),
      }),
      stars: () => ({
        starSize: rnd(0.5, 2),
        density: rnd(0.5, 2),
        starBrightness: rnd(0.5, 1),
      }),
      color: () => {
        const colorMode = pickBool(0.6) ? 'multi' : 'single'
        return {
          colorMode,
          starColor: pick(['#ffffff', '#00d4ff', '#7c3aed', '#ff00ff', '#00ffff']),
          colorPalette: pick(['classic', 'rainbow', 'ocean', 'fire']) as any,
        }
      },
      effects: () => ({
        glow: rnd(0, 1.5),
        twinkle: rnd(0, 0.5),
        turbulence: rnd(0, 2),
      }),
      center: () => ({
        centerMode: pickBool(0.8) ? 'center' : 'mouse',
        centerX: rnd(0.3, 0.7),
        centerY: rnd(0.3, 0.7),
      }),
    }

    const partial = tab && byTab[tab] ? byTab[tab]() : all()
    return { ...config, ...partial }
  },
  presets: [
    {
      id: 'rainbow',
      name: { en: 'Rainbow', 'zh-CN': '彩虹' },
      config: {
        rotateSpeed: 1.5,
        density: 0.5,
        trailLength: 0.98,
        starSize: 1.2,
        colorMode: 'multi',
        colorPalette: 'rainbow',
        renderMode: 'path',
        pathLength: 0.8,
        starBrightness: 1.0,
        twinkle: 0.4,
        centerX: 0.5,
        centerY: 0.5,
      },
    },
    {
      id: 'classic',
      name: { en: 'Classic', 'zh-CN': '经典' },
      config: {
        rotateSpeed: 0.8,
        density: 0.5,
        trailLength: 0.95,
        starSize: 1.0,
        colorMode: 'single',
        starColor: '#ffffff',
        renderMode: 'path',
        pathLength: 0.5,
        starBrightness: 0.8,
        twinkle: 0.2,
        centerX: 0.5,
        centerY: 0.5,
      },
    },
  ],
}
