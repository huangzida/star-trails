# @bg-effects/star-trails

[English](./README.md) | [简体中文](./README_CN.md)

A Vue-based star trails background effect component with both path and persistence rendering modes, plus a built-in debug panel.

[Live Demo](https://huangzida.github.io/star-trails/)

---

### Features

- Core capability: Includes the `StarTrails` component and `StarTrailsEngine` renderer for dense star-trail animations.
- Rendering modes: Supports both `path` and `persistence` modes, with optional long-exposure effects.
- Interactivity: Supports fixed center or mouse-follow center, plus randomization and real-time debug tuning.
- Color system: Supports single-color mode and multi-palette mode (`classic` / `rainbow` / `ocean` / `fire`).

### Installation

```bash
pnpm add @bg-effects/star-trails
```

### Main API

- Component export: `StarTrails` (also the default export).
- Debug panel: `ConfigPanel`.
- Metadata: `meta` (contains default config, presets, and randomization logic).
- Type exports: `StarTrailsConfig` and related union types.

### Usage Example

```vue
<script setup lang="ts">
import { StarTrails } from '@bg-effects/star-trails'
</script>

<template>
  <div style="width: 100vw; height: 100vh; background: #000;">
    <StarTrails
      :density="1.2"
      render-mode="path"
      trail-type="radial"
      color-mode="multi"
      color-palette="rainbow"
      :debug="true"
      lang="zh-CN"
    />
  </div>
</template>
```

### Local Development

```bash
pnpm install
pnpm dev
```

### License

MIT
