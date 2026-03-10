import type { StarTrailsConfig } from '../types'

function hexToRgb(hex: string) {
  let r = 255, g = 255, b = 255
  const h = hex.replace('#', '')
  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16)
    g = parseInt(h[1] + h[1], 16)
    b = parseInt(h[2] + h[2], 16)
  } else if (h.length === 6) {
    r = parseInt(h.substring(0, 2), 16)
    g = parseInt(h.substring(2, 4), 16)
    b = parseInt(h.substring(4, 6), 16)
  }
  return { r, g, b }
}

export class StarTrailsEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private config: StarTrailsConfig
  
  // 每顺位存储: [angle, distance, speed, size, r, g, b, prevX, prevY]
  private starsData: Float32Array = new Float32Array(0)
  private starCount = 0
  private animationId = 0
  private time = 0
  private mouseX = 0
  private mouseY = 0
  private clearCounter = 0
  private isRunning = false

  constructor(canvas: HTMLCanvasElement, config: StarTrailsConfig) {
    this.canvas = canvas
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) throw new Error('Could not get 2d context')
    this.ctx = context
    this.config = config
    
    this.mouseX = window.innerWidth / 2
    this.mouseY = window.innerHeight / 2
    
    this.handleMouseMove = this.handleMouseMove.bind(this)
    window.addEventListener('mousemove', this.handleMouseMove)
    
    this.resize()
  }

  public updateConfig(newConfig: StarTrailsConfig) {
    const oldConfig = this.config
    this.config = newConfig
    
    // Check if we need to re-init stars
    if (
      oldConfig.density !== newConfig.density ||
      oldConfig.colorMode !== newConfig.colorMode ||
      oldConfig.colorPalette !== newConfig.colorPalette ||
      oldConfig.starColor !== newConfig.starColor ||
      oldConfig.trailType !== newConfig.trailType
    ) {
      this.initStars()
    }
  }

  private handleMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX
    this.mouseY = e.clientY
  }

  public resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    // Context needs to be re-obtained? No, but some state might reset? No, 2D context persists.
    // However, in index.vue, it did: ctx = canvas.getContext... again. Not strictly necessary unless context was lost.
    // But setting width/height clears the canvas.
    this.initStars()
  }

  private initStars() {
    const width = this.canvas.width
    const height = this.canvas.height
    // 限制密度以保护性能，最高 4000 颗星
    this.starCount = Math.min(Math.floor(1500 * (this.config.density || 0.5)), 4000)
    this.starsData = new Float32Array(this.starCount * 9)

    const centerX = width / 2
    const centerY = height / 2
    const maxDist = Math.sqrt(width * width + height * height)

    const baseColor = hexToRgb(this.config.starColor || '#ffffff')

    for (let i = 0; i < this.starCount; i++) {
      const idx = i * 9
      const distance = Math.random() * maxDist
      const angle = Math.random() * Math.PI * 2
      const speed = 0.0005 + Math.random() * 0.0015
      const size = 0.5 + Math.random() * 2

      let r, g, b
      if (this.config.colorMode === 'multi') {
        const p = this.config.colorPalette
        if (p === 'rainbow') {
          const hue = Math.random() * 360
          // 简单的 HSL 转 RGB 逻辑
          const s = 0.8; const l = 0.7
          const c = (1 - Math.abs(2 * l - 1)) * s
          const x = c * (1 - Math.abs((hue / 60) % 2 - 1))
          const m = l - c / 2
          let rt = 0, gt = 0, bt = 0
          if (hue < 60) { rt = c; gt = x }
          else if (hue < 120) { rt = x; gt = c }
          else if (hue < 180) { gt = c; bt = x }
          else if (hue < 240) { gt = x; bt = c }
          else if (hue < 300) { rt = x; bt = c }
          else { rt = c; bt = x }
          r = (rt + m) * 255; g = (gt + m) * 255; b = (bt + m) * 255
        }
        else if (p === 'ocean') {
          r = 50 + Math.random() * 50; g = 150 + Math.random() * 100; b = 255
        }
        else if (p === 'fire') {
          r = 255; g = 50 + Math.random() * 150; b = Math.random() * 50
        }
        else {
          // classic
          const type = Math.random()
          if (type > 0.8) { r = 150 + Math.random() * 50; g = 180 + Math.random() * 75; b = 255 }
          else if (type > 0.6) { r = 255; g = 240 + Math.random() * 15; b = 180 + Math.random() * 75 }
          else { r = 255; g = 255; b = 255 }
        }
      } else {
        r = baseColor.r; g = baseColor.g; b = baseColor.b
      }

      this.starsData[idx] = angle
      this.starsData[idx + 1] = distance
      this.starsData[idx + 2] = speed
      this.starsData[idx + 3] = size
      this.starsData[idx + 4] = r
      this.starsData[idx + 5] = g
      this.starsData[idx + 6] = b
      this.starsData[idx + 7] = centerX + Math.cos(angle) * distance // prevX
      this.starsData[idx + 8] = centerY + Math.sin(angle) * distance // prevY
    }
  }

  public start() {
    if (this.isRunning) return
    this.isRunning = true
    this.updateAndDraw()
  }

  public stop() {
    this.isRunning = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = 0
    }
  }

  public pause() {
    this.stop()
  }

  public resume() {
    this.start()
  }

  public restart() {
    this.initStars()
    this.start()
  }

  public destroy() {
    this.stop()
    window.removeEventListener('mousemove', this.handleMouseMove)
  }

  private updateAndDraw = () => {
    if (!this.isRunning) return

    const width = this.canvas.width
    const height = this.canvas.height
    this.time += 0.01

    const targetX = this.config.centerMode === 'mouse' ? this.mouseX : width * (this.config.centerX ?? 0.5)
    const targetY = this.config.centerMode === 'mouse' ? this.mouseY : height * (this.config.centerY ?? 0.5)

    const { 
      renderMode = 'persistence', 
      longExposure = false, 
      trailLength = 0.5, 
      starBrightness = 1, 
      twinkle = 0, 
      turbulence = 0, 
      starSize = 1, 
      glow = 0, 
      rotateSpeed = 1, 
      radialSpeed = 0, 
      trailType = 'concentric',
      pathLength = 0
    } = this.config

    // 1. 清理逻辑
    this.ctx.globalCompositeOperation = 'source-over'
    if (renderMode === 'path') {
      // 路径模式：每帧完全清空，不依赖残留
      this.ctx.clearRect(0, 0, width, height)
    } else {
      // 残留模式：部分清空
      if (!longExposure) {
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, width, height)
      } else {
        const decay = 1 - Math.pow(trailLength, 5)
        this.ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0.0005, decay)})`
        this.ctx.fillRect(0, 0, width, height)

        this.clearCounter++
        if (this.clearCounter > 2000) {
          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
          this.ctx.fillRect(0, 0, width, height)
          this.clearCounter = 0
        }
      }
    }

    // 2. 批量渲染
    this.ctx.globalCompositeOperation = 'lighter'
    const isConcentric = trailType === 'concentric'
    const maxDist = Math.sqrt(width * width + height * height)

    for (let i = 0; i < this.starCount; i++) {
      const idx = i * 9
      
      // 更新基础状态
      this.starsData[idx] += this.starsData[idx + 2] * rotateSpeed // angle
      if (!isConcentric) {
        this.starsData[idx + 1] += radialSpeed * (this.starsData[idx + 1] * 0.01) // distance
      }

      // 计算闪烁 (Twinkle)
      let alpha = starBrightness
      if (twinkle > 0) {
        alpha *= (1 - twinkle) + Math.sin(this.time * 5 + i) * twinkle
      }

      // 计算湍流位移 (Turbulence)
      let offsetX = 0, offsetY = 0
      if (turbulence > 0) {
        offsetX = Math.sin(this.time * 2 + i) * turbulence
        offsetY = Math.cos(this.time * 2 + i) * turbulence
      }

      const currentDist = this.starsData[idx + 1]
      const currentAngle = this.starsData[idx]
      const x = targetX + Math.cos(currentAngle) * currentDist + offsetX
      const y = targetY + Math.sin(currentAngle) * currentDist + offsetY

      const r = this.starsData[idx + 4]; const g = this.starsData[idx + 5]; const b = this.starsData[idx + 6]
      const size = this.starsData[idx + 3] * starSize

      if (renderMode === 'path' && pathLength > 0) {
        // --- 路径模式：绘制完整弧线 ---
        const pLen = pathLength * Math.PI * 0.5 // 路径涵盖的角度
        
        this.ctx.beginPath()
        this.ctx.lineWidth = size
        this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`

        if (isConcentric) {
          // 同心圆模式：直接使用原生 arc 保证完美曲率 (不显示转角)
          this.ctx.arc(targetX + offsetX, targetY + offsetY, currentDist, currentAngle - pLen, currentAngle)
        } else {
          // 径向螺旋模式：增加采样频率确保圆润
          const segments = Math.max(30, Math.floor(100 * pathLength))
          for (let s = 0; s <= segments; s++) {
            const ratio = s / segments
            const segmentAngle = currentAngle - pLen * ratio
            // 在路径渲染中，我们反向推导路径时暂不回溯径向位移，以保持一致的视觉质感
            const px = targetX + Math.cos(segmentAngle) * currentDist + offsetX
            const py = targetY + Math.sin(segmentAngle) * currentDist + offsetY
            
            if (s === 0) this.ctx.moveTo(px, py)
            else this.ctx.lineTo(px, py)
          }
        }
        this.ctx.stroke()

        if (glow > 0) {
          this.ctx.beginPath()
          this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.1 * glow * alpha})`
          this.ctx.lineWidth = size * (2 + glow * 4)
          if (isConcentric) {
            this.ctx.arc(targetX + offsetX, targetY + offsetY, currentDist, currentAngle - pLen * 0.3, currentAngle)
          } else {
            this.ctx.moveTo(x, y)
            const angleEnd = currentAngle - pLen * 0.2
            this.ctx.lineTo(targetX + Math.cos(angleEnd) * currentDist, targetY + Math.sin(angleEnd) * currentDist)
          }
          this.ctx.stroke()
        }
      } else {
        // --- 残留模式 (原有逻辑) ---
        if (glow > 0) {
          this.ctx.beginPath()
          this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.2 * glow * alpha})`
          this.ctx.lineWidth = size * (2 + glow * 2)
          this.ctx.moveTo(this.starsData[idx + 7], this.starsData[idx + 8])
          this.ctx.lineTo(x, y)
          this.ctx.stroke()
        }

        this.ctx.beginPath()
        this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        this.ctx.lineWidth = size
        this.ctx.moveTo(this.starsData[idx + 7], this.starsData[idx + 8])
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
      }

      // 更新残留位置（供残留模式使用）
      this.starsData[idx + 7] = x
      this.starsData[idx + 8] = y

      // 重置逻辑
      if (this.starsData[idx + 1] > maxDist || this.starsData[idx + 1] < -10) {
        this.starsData[idx + 1] = radialSpeed > 0 ? 0 : maxDist
        this.starsData[idx + 7] = targetX + Math.cos(this.starsData[idx]) * this.starsData[idx + 1]
        this.starsData[idx + 8] = targetY + Math.sin(this.starsData[idx]) * this.starsData[idx + 1]
      }
    }

    this.animationId = requestAnimationFrame(this.updateAndDraw)
  }
}
