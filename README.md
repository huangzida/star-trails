# @bg-effects/star-trails

[English](./README.md) | [简体中文](./README_CN.md)

基于 Vue 的星轨背景特效组件，支持路径渲染与残影渲染两种模式，并内置调试面板。

[Live Demo](https://huangzida.github.io/star-trails/)

---

### 功能模块

- 核心能力：提供 `StarTrails` 组件与 `StarTrailsEngine` 渲染引擎，支持高密度星轨动画。
- 渲染模式：支持 `path`（路径）与 `persistence`（残影）两种模式，可切换长曝光效果。
- 交互能力：支持中心点固定或跟随鼠标，支持随机化参数与调试面板实时调参。
- 颜色系统：支持单色与多色调色盘（`classic` / `rainbow` / `ocean` / `fire`）。

### 安装

```bash
pnpm add @bg-effects/star-trails
```

### 主要 API

- 组件导出：`StarTrails`（默认导出同名组件）。
- 调试面板：`ConfigPanel`。
- 元信息：`meta`（含默认配置、预设与随机化逻辑）。
- 类型导出：`StarTrailsConfig` 及相关联合类型。

### 使用示例

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

### 本地开发

```bash
pnpm install
pnpm dev
```

### License

MIT
