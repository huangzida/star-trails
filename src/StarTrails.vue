<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineAsyncComponent, computed } from 'vue'
import { StarTrailsEngine } from './engine/StarTrailsEngine'
import type { StarTrailsConfig } from './types'
import { meta } from './meta'
import { defu } from 'defu'
import { DebugShell } from '@bg-effects/debug-ui'

const props = defineProps<Partial<StarTrailsConfig> & {
  debug?: boolean
  lang?: 'zh-CN' | 'en'
}>()

const ConfigContent = defineAsyncComponent(() => import('./ui/ConfigPanel.vue'))
const configContentRef = ref<any>(null)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let engine: StarTrailsEngine | null = null

const resolveEngineConfig = (input: any) => {
  const merged = defu(input, meta.defaultConfig) as any
  const {
    rotateSpeed,
    density,
    trailLength,
    starSize,
    colorMode,
    starColor,
    radialSpeed,
    glow,
    centerMode,
    longExposure,
    trailType,
    colorPalette,
    renderMode,
    pathLength,
    starBrightness,
    twinkle,
    turbulence,
    centerX,
    centerY,
  } = merged

  return {
    rotateSpeed,
    density,
    trailLength,
    starSize,
    colorMode,
    starColor,
    radialSpeed,
    glow,
    centerMode,
    longExposure,
    trailType,
    colorPalette,
    renderMode,
    pathLength,
    starBrightness,
    twinkle,
    turbulence,
    centerX,
    centerY,
  } as StarTrailsConfig
}

const config = ref<any>(resolveEngineConfig(props))
const internalLang = ref<'zh-CN' | 'en'>(props.lang || 'zh-CN')

watch(() => props, (newProps) => {
  if (!props.debug) {
    config.value = resolveEngineConfig(newProps)
  }
}, { deep: true })

const handleResize = () => {
  if (engine) {
    engine.resize()
  }
}

const engineInterface = computed(() => ({
  pause: () => engine?.pause(),
  resume: () => engine?.resume(),
  restart: () => engine?.restart(),
}))

const handleRandomize = () => {
  if (!meta.randomize) return
  const currentTab = configContentRef.value?.activeTab as any
  const tabValue = typeof currentTab === 'object' && currentTab?.value ? currentTab.value : currentTab
  const newConfig = meta.randomize(resolveEngineConfig(config.value), tabValue)
  config.value = { ...config.value, ...newConfig }
}

onMounted(() => {
  if (canvasRef.value) {
    engine = new StarTrailsEngine(canvasRef.value, resolveEngineConfig(config.value))
    engine.start()
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (engine) {
    engine.destroy()
    window.removeEventListener('resize', handleResize)
  }
})

watch(config, (newConfig) => {
  if (!engine) return
  engine.updateConfig(resolveEngineConfig(newConfig))
}, { deep: true })
</script>

<template>
  <div class="star-trails-container absolute inset-0">
    <canvas
      ref="canvasRef"
      class="fixed inset-0 w-full h-full bg-black touch-none pointer-events-none"
    />
    <DebugShell
      v-if="debug"
      v-model:config="config"
      v-model:lang="internalLang"
      :meta="meta"
      :engine="engineInterface"
      @randomize="handleRandomize"
    >
      <template #settings>
        <ConfigContent ref="configContentRef" :config="config" :lang="internalLang" />
      </template>
    </DebugShell>
  </div>
</template>
