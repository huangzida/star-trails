<script setup lang="ts">
import { Slider, ColorPicker, Select, Toggle, Panel, SubTabs } from '@bg-effects/shared'
import type { StarTrailsConfig } from '../types'
import { computed, ref } from 'vue'
import zhCN from '../locales/zh-CN.json'
import en from '../locales/en.json'

const props = defineProps<{
  config: StarTrailsConfig
  lang?: 'zh-CN' | 'en'
}>()

const activeTab = ref('render')

const i18n: Record<string, any> = {
  'zh-CN': zhCN,
  'en': en,
}

const t = (path: string) => {
  const dict = i18n[props.lang || 'zh-CN'] || i18n['en']
  return path.split('.').reduce((obj: any, key) => obj?.[key], dict) || path
}

interface SubTabItem {
  id: string
  label: string
}

const subTabs = computed((): SubTabItem[] => [
  { id: 'render', label: t('star-trails.config.render_mode') },
  { id: 'trail', label: t('star-trails.config.trail_type') },
  { id: 'stars', label: t('star-trails.config.star_size') },
  { id: 'color', label: t('star-trails.config.color_mode') },
  { id: 'effects', label: t('star-trails.config.glow') },
  { id: 'center', label: t('star-trails.config.center_mode') },
])

defineExpose({
  activeTab,
})

// Options for selects
const renderModeOptions = computed(() => [
  { label: t('star-trails.options.persistence'), value: 'persistence' },
  { label: t('star-trails.options.path'), value: 'path' }
])

const centerModeOptions = computed(() => [
  { label: t('star-trails.options.center'), value: 'center' },
  { label: t('star-trails.options.mouse'), value: 'mouse' }
])

const trailTypeOptions = computed(() => [
  { label: t('star-trails.options.radial'), value: 'radial' },
  { label: t('star-trails.options.concentric'), value: 'concentric' }
])

const colorModeOptions = computed(() => [
  { label: t('star-trails.options.single'), value: 'single' },
  { label: t('star-trails.options.multi'), value: 'multi' }
])

const paletteOptions = computed(() => [
  { label: t('star-trails.options.classic'), value: 'classic' },
  { label: t('star-trails.options.rainbow'), value: 'rainbow' },
  { label: t('star-trails.options.ocean'), value: 'ocean' },
  { label: t('star-trails.options.fire'), value: 'fire' }
])
</script>

<template>
  <Panel>
    <SubTabs v-model="activeTab" :tabs="subTabs" :rows="2" />

    <div class="flex flex-col gap-6 p-1 pointer-events-auto overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
      <div v-if="activeTab === 'render'" class="flex flex-col gap-6">
        <Select
          v-model="config.renderMode"
          :options="renderModeOptions"
          :label="t('star-trails.config.render_mode')"
        />
        <Toggle
          v-if="config.renderMode === 'persistence'"
          v-model="config.longExposure"
          :label="t('star-trails.config.long_exposure')"
        />
        <Slider
          v-if="config.renderMode === 'path'"
          v-model="config.pathLength"
          :min="0"
          :max="1"
          :step="0.01"
          :label="t('star-trails.config.path_length')"
        />
        <Slider
          v-if="config.renderMode === 'persistence'"
          v-model="config.trailLength"
          :min="0"
          :max="0.99"
          :step="0.01"
          :label="t('star-trails.config.trail_length')"
        />
      </div>

      <div v-else-if="activeTab === 'trail'" class="flex flex-col gap-6">
        <Select
          v-model="config.trailType"
          :options="trailTypeOptions"
          :label="t('star-trails.config.trail_type')"
        />
        <Slider
          v-if="config.trailType === 'radial'"
          v-model="config.radialSpeed"
          :min="-1"
          :max="1"
          :step="0.01"
          :label="t('star-trails.config.radial_speed')"
        />
        <Slider
          v-model="config.rotateSpeed"
          :min="-5"
          :max="5"
          :step="0.1"
          :label="t('star-trails.config.rotate_speed')"
        />
      </div>

      <div v-else-if="activeTab === 'stars'" class="flex flex-col gap-6">
        <Slider
          v-model="config.starSize"
          :min="0.1"
          :max="3"
          :step="0.1"
          :label="t('star-trails.config.star_size')"
        />
        <Slider
          v-model="config.density"
          :min="0.1"
          :max="2"
          :step="0.1"
          :label="t('star-trails.config.density')"
        />
        <Slider
          v-model="config.starBrightness"
          :min="0"
          :max="1"
          :step="0.01"
          :label="t('star-trails.config.star_brightness')"
        />
      </div>

      <div v-else-if="activeTab === 'color'" class="flex flex-col gap-6">
        <Select
          v-model="config.colorMode"
          :options="colorModeOptions"
          :label="t('star-trails.config.color_mode')"
        />
        <ColorPicker
          v-if="config.colorMode === 'single'"
          v-model="config.starColor"
          :label="t('star-trails.config.star_color')"
        />
        <Select
          v-if="config.colorMode === 'multi'"
          v-model="config.colorPalette"
          :options="paletteOptions"
          :label="t('star-trails.config.palette')"
        />
      </div>

      <div v-else-if="activeTab === 'effects'" class="flex flex-col gap-6">
        <Slider
          v-model="config.glow"
          :min="0"
          :max="2"
          :step="0.1"
          :label="t('star-trails.config.glow')"
        />
        <Slider
          v-model="config.twinkle"
          :min="0"
          :max="1"
          :step="0.01"
          :label="t('star-trails.config.twinkle')"
        />
        <Slider
          v-model="config.turbulence"
          :min="0"
          :max="2"
          :step="0.01"
          :label="t('star-trails.config.turbulence')"
        />
      </div>

      <div v-else-if="activeTab === 'center'" class="flex flex-col gap-6">
        <Select
          v-model="config.centerMode"
          :options="centerModeOptions"
          :label="t('star-trails.config.center_mode')"
        />
        <template v-if="config.centerMode === 'center'">
          <Slider
            v-model="config.centerX"
            :min="0"
            :max="1"
            :step="0.01"
            :label="t('star-trails.config.center_x')"
          />
          <Slider
            v-model="config.centerY"
            :min="0"
            :max="1"
            :step="0.01"
            :label="t('star-trails.config.center_y')"
          />
        </template>
      </div>
    </div>
  </Panel>
</template>
