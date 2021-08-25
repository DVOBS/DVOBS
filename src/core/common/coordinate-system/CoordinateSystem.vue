<template>
  <div
    class="main-coordinate-system"
    :class="{ draging }"
    @wheel.prevent="handleWhell"
    @mousedown.stop="startDrag($event)"
  >
    <div class="x-axis" :style="xAxisStyle">
      <canvas ref="xcanvas" :width="width" :height="axisWidth"></canvas>
    </div>
    <div class="y-axis" :style="yAxisStyle">
      <canvas ref="ycanvas" :width="axisWidth" :height="height"></canvas>
    </div>
    <div class=""></div>
    <div class="content" :style="contentStyle" ref="content">
      <div class="default-solt" :style="defaultSoltStyle"><slot></slot></div>
    </div>
    <div class="mask-layer" v-show="mask" :style="unscaleLayerStyle">
      <!-- <div class="view-box-boundary" :style="viewBoxBoundaryStyle"></div> -->
    </div>
    <div class="unscale-layer" :style="unscaleLayerStyle">
      <slot name="unscale"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Provide, Vue, Watch } from 'vue-property-decorator'
import { addListener, removeListener } from 'resize-detector'

@Component
export default class CoordinateSystem extends Vue {
  @Provide('coordinate-system')
  get CoordinateSystem (): CoordinateSystem {
    return this
  }

  @Prop({ default: true })
  public dragable !: boolean

  @Prop({ default: false })
  public mask !: boolean

  @Prop({ default: false })
  public wheelCtrl !: boolean

  @Prop({ type: Number, default: 25 })
  public axisWidth!: number

  @Prop({ type: Number, default: 5 })
  public tickLength!: number

  @Prop({ type: Number, default: 2 })
  public subTickLength!: number

  @Prop({ type: Number, default: 10 })
  public tickTextMargin!: number

  @Prop({ type: Number, default: 12 })
  public textFontSize!: number

  @Prop({ required: false, default: '#212121'})
  public bgColor!: string

  @Prop({ required: false, default: '#ffffff'})
  public textColor!: string

  @Prop({ required: false, default: 8 })
  public maxScale !: number

  @Prop({ required: false, default: 0.125 })
  public minScale !: number

  @Prop({ required: false, default: () => {
      return { x0: -Infinity, y0: -Infinity, x1: Infinity, y1: Infinity }
    }
  })
  public boundary !: [number, number, number, number]

  public scale = 1
  public width = 0
  public height = 0
  public offsetX = 50
  public offsetY = 50

  public draging = false
  public initialState: any = null;
  public controllers: any[] = []

  get xAxisStyle () {
    return {
      'background-color': this.bgColor,
      'height': this.axisWidth + 'px'
    }
  }

  get yAxisStyle () {
    return {
      'background-color': this.bgColor,
      'width': this.axisWidth + 'px',
    }
  }

  get viewBoxBoundary() {
    const x0 = this.boundary[0]
    const y0 = this.boundary[1]
    const x1 = this.boundary[2]
    const y1 = this.boundary[3]
    return {
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
      w: x1 - x0,
      h: y1 - y0
    }
  }

  get viewBoxBoundaryStyle() {
    return {
      top: (this.viewBoxBoundary.y0) * this.scale + 'px',
      left: (this.viewBoxBoundary.x0) * this.scale + 'px',
      width: this.viewBoxBoundary.w * this.scale + 'px',
      height: this.viewBoxBoundary.h * this.scale + 'px',
    }
  }

  get viewBox() {
    const x0 = ~~(0 - this.offsetX)
    const y0 = ~~(0 - this.offsetY)
    const x1 = ~~((this.width - this.axisWidth) / this.scale - this.offsetX)
    const y1 = ~~((this.height - this.axisWidth) / this.scale - this.offsetY)
    return {
      x0,
      y0,
      x1,
      y1,
      w: x1 - x0,
      h: y1 - y0
    }
  }

  get defaultSoltStyle () {
    return {
      transform: `translate(${this.offsetX * this.scale}px, ${this.offsetY * this.scale}px) scale(${this.scale})`,
      transformOrigin: 'left top'
    }
  }

  get unscaleLayerStyle () {
    const offsetX = this.offsetX * this.scale + this.axisWidth
    const offsetY = this.offsetY * this.scale + this.axisWidth
    return {
      top: offsetY + 'px',
      left: offsetX + 'px'
    }
  }

  get scaleDivision() {
        let scaleDivision = 100

    if (this.scale < 0.5) {
      scaleDivision = 1000
    }

    if (this.scale > 2) {
      scaleDivision = 50
    }

    if (this.scale > 3) {
      scaleDivision = 20
    }

    if (this.scale >= 5) {
      scaleDivision = 10
    }
    return scaleDivision
  }

  get contentStyle () {
    const scale = this.scale
    const canvas = document.createElement('canvas')
    const size = ~~(this.scaleDivision * scale)
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    if (context) {
      context.strokeStyle = 'rgba(255,255,255,0.25)'
      context.lineWidth = 1
      context.moveTo(0, 0)
      context.lineTo(size, 0)
      context.lineTo(size, size)
      context.stroke()
      context.strokeStyle = 'rgba(255,255,255,0.05)'
      for (let i = 0; i <= 9; i++) {
        context.moveTo(i * size / 10, 0)
        context.lineTo(i * size / 10, size)

        context.moveTo(0, i * size / 10)
        context.lineTo(size, i * size / 10)
      }
      context.stroke()
    }
    const base64 = canvas.toDataURL()
    return {
      'background-image': `url(${base64})`,
      'background-color': this.bgColor,
      'background-position-x': this.offsetX * scale + 0.5 + 'px',
      'background-position-y': this.offsetY * scale + 0.5 + 'px',
      'background-size': size + 'px',
      'top': this.axisWidth + 'px',
      'left': this.axisWidth + 'px'
    }
  }

  public getAxisPosition(event: MouseEvent) {
    const content = this.$refs.content as HTMLDivElement
    const bc = content.getBoundingClientRect()
    const x = ~~((event.clientX - bc.x) / this.scale - this.offsetX)
    const y = ~~((event.clientY - bc.y) / this.scale - this.offsetY)
    return {x, y}
  }

  public handleWhell (event: WheelEvent) {
    const p0 = this.getAxisPosition(event)
    if (event.ctrlKey || !this.wheelCtrl) {
      let scale = this.scale + -event.deltaY / 1000

      if (scale > this.maxScale) {
        scale = this.maxScale
      }
      if (scale < this.minScale) {
        scale = this.minScale
      }
      this.scale = Number(scale.toFixed(3))
    }
    const p1 = this.getAxisPosition(event)
    this.offsetX += p1.x - p0.x
    this.offsetY += p1.y - p0.y
  }

  public startDrag (event: MouseEvent) {
    if (!this.dragable) {
      return
    }
    this.draging = true
    this.initialState = {
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      clientX: event.clientX,
      clientY: event.clientY
    }

    document.addEventListener('mousemove', this.onMoving)
    document.addEventListener('mouseup', this.endDrag)
  }

  public onMoving (event: MouseEvent) {
    const initialState = this.initialState
    const dx = event.clientX - initialState.clientX
    const dy = event.clientY - initialState.clientY

    this.offsetX = Math.round(initialState.offsetX + dx / this.scale)
    this.offsetY = Math.round(initialState.offsetY + dy / this.scale)

    this.checkOffset()
  }

  public endDrag (event: MouseEvent) {
    this.onMoving(event)

    delete this.initialState
    this.draging = false

    document.removeEventListener('mousemove', this.onMoving)
    document.removeEventListener('mouseup', this.endDrag)
  }

  @Watch('scale')
  public checkOffset () {
    const viewBoxBoundary = this.viewBoxBoundary
    const viewBox = this.viewBox
    if (viewBoxBoundary.w > viewBox.w) {
      if (viewBox.x0 < viewBoxBoundary.x0) {
        this.offsetX = -viewBoxBoundary.x0
      }
      if (viewBox.x1 > viewBoxBoundary.x1) {
        this.offsetX = -(viewBoxBoundary.x1 - viewBox.w)
      }
    } else {
      if (this.offsetX < -viewBoxBoundary.x0) {
        this.offsetX = -viewBoxBoundary.x0
      }

      if (this.offsetX + viewBoxBoundary.x1 > viewBox.w) {
        this.offsetX = viewBox.w - viewBoxBoundary.x1
      }
    }

    if (viewBoxBoundary.h > viewBox.h) {
      if (viewBox.y0 < viewBoxBoundary.y0) {
        this.offsetY = -viewBoxBoundary.y0
      }
      if (viewBox.y1 > viewBoxBoundary.y1) {
        this.offsetY = -(viewBoxBoundary.y1 - viewBox.h)
      }
    } else {
      if (this.offsetY < -viewBoxBoundary.y0) {
        this.offsetY = -viewBoxBoundary.y0
      }

      if (this.offsetY + viewBoxBoundary.y1 > viewBox.h) {
        this.offsetY = viewBox.h - viewBoxBoundary.y1
      }
    }
  }

  @Watch('scale')
  @Watch('width')
  @Watch('height')
  @Watch('offsetX')
  @Watch('offsetY')
  @Watch('axisWidth')
  @Watch('tickLength')
  @Watch('subTickLength')
  @Watch('tickTextMargin')
  @Watch('textFontSize')
  @Watch('textColor')
  public renderAxis () {
    this.$nextTick(() => {
      const scale = this.scale
      const xcanvas = this.$refs.xcanvas as HTMLCanvasElement
      const xcontext = xcanvas.getContext('2d')
      const ycanvas = this.$refs.ycanvas as HTMLCanvasElement
      const ycontext = ycanvas.getContext('2d')
      if (xcontext && ycontext) {
        xcontext.clearRect(0, 0, this.width, this.axisWidth)
        xcontext.font = `${this.textFontSize}px Arial`
        xcontext.lineWidth = 1
        xcontext.strokeStyle = this.textColor
        xcontext.fillStyle = this.textColor
        xcontext.textAlign = 'center'
        xcontext.textBaseline = 'middle'

        ycontext.clearRect(0, 0, this.height, this.axisWidth)
        ycontext.font = `${this.textFontSize}px Arial`
        ycontext.lineWidth = 1
        ycontext.strokeStyle = this.textColor
        ycontext.fillStyle = this.textColor
        ycontext.textAlign = 'center'
        ycontext.textBaseline = 'middle'

        ycontext.setTransform()
        ycontext.translate(this.axisWidth, 0)
        ycontext.rotate(90 * Math.PI / 180)

        let scaleDivision = this.scaleDivision

        const xStart = -this.offsetX
        const xStartTicket = Math.floor(xStart / scaleDivision) * scaleDivision

        let x = 0
        for (let index = xStartTicket; x <= this.width + scaleDivision; index += scaleDivision) {
          x = (-xStart + index) * scale + this.axisWidth
          xcontext.beginPath()
          xcontext.moveTo(x, this.axisWidth - this.tickLength)
          xcontext.lineTo(x, this.axisWidth)
          xcontext.fillText(String(index), x, this.axisWidth - this.tickTextMargin - 0.9 * this.textFontSize / 2 + 1)

          for (let i = 1; i < 10; i++) {
            xcontext.moveTo(x + i * scale * scaleDivision / 10, this.axisWidth - this.subTickLength)
            xcontext.lineTo(x + i * scale * scaleDivision / 10, this.axisWidth)
          }
          xcontext.stroke()
        }

        let y = 0
        const yStart = -this.offsetY
        const yStartTicket = Math.floor(yStart / scaleDivision) * scaleDivision
        for (let index = yStartTicket; y <= this.height + scaleDivision; index += scaleDivision) {
          y = (-yStart + index) * scale + this.axisWidth
          ycontext.beginPath()
          ycontext.moveTo(y, 0)
          ycontext.lineTo(y, this.tickLength)
          ycontext.fillText(String(index), y, this.tickTextMargin +  0.9 * this.textFontSize / 2)

          for (let i = 1; i < 10; i++) {
            ycontext.moveTo(y + i * scale * scaleDivision / 10, 0)
            ycontext.lineTo(y + i * scale * scaleDivision / 10, this.subTickLength)
          }
          ycontext.stroke()
        }

        xcontext.clearRect(0, 0, this.axisWidth, this.axisWidth)
        ycontext.clearRect(0, 0, this.axisWidth, this.axisWidth)
      }
    })
  }

  public getPosition (event: MouseEvent) {
    const content = this.$refs.content as HTMLDivElement
    const bc = content.getBoundingClientRect()
    const x = (event.clientX - bc.x) / this.scale - this.offsetX
    const y = (event.clientY - bc.y) / this.scale - this.offsetY
    this.$emit('drop', {
      x: Math.round(x),
      y: Math.round(y)
    })
  }

  public onResize (event: HTMLElement) {
    this.width = event.clientWidth
    this.height = event.clientHeight
  }

  public mounted () {
    this.onResize(this.$el as HTMLDivElement)
    addListener(this.$el as HTMLDivElement, this.onResize)
  }

  public beforeDestroy () {
    removeListener(this.$el as HTMLDivElement, this.onResize)
  }
}
</script>
<style scoped lang="scss">
$background-color: #212121;

.main-coordinate-system {
  position: relative;
  overflow: hidden;
  height: 100%;

  &.draging {
    cursor: move;
  }

  .x-axis {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    color: white;
    font-size: 10px;
    z-index: 20;
    background: $background-color;
  }

  .y-axis {
    position: absolute;
    top: 0px;
    left: 0px;
    overflow: hidden;
    color: white;
    font-size: 10px;
    z-index: 20;
    background: $background-color;
  }

  .content {
    position: absolute;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background: $background-color;
  }

  .mask-layer {
    position: absolute;
    z-index: 1;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }

  .view-box-boundary {
    position: absolute;
    border: dashed rgba(255, 166, 0, 0.75) 1px;
    box-sizing: border-box;
  }

  .unscale-layer {
    position: absolute;
    z-index: 10;
  }

  .default-solt,
  .default-solt * {
    user-select: none;
  }
}
</style>
